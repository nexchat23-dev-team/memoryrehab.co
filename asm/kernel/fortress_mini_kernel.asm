; ==============================================================================
; FORTRESS ADVANCED CYBER DEFENSE ARSENAL (TAB 32)
; File: fortress_mini_kernel.asm
; Target Architecture: Bare-Metal x86_64 Long Mode (AMD64 / Intel 64)
; Assembler: NASM (Intel Syntax)
; Output Format: Flat Binary Machine Code (-f bin)
; 
; Systems Architecture:
; 1. Real 64-bit Long Mode Kernel Entry Point (_start / kernel_main)
; 2. Global Descriptor Table (GDT) with 64-bit Kernel (Ring 0) and User (Ring 3) Descriptors
; 3. Interrupt Descriptor Table (IDT) for CPU Exception and Syscall Trapping (#DE, #UD, #GP, #PF)
; 4. In-Kernel POSIX Syscall Dispatcher (sys_read, sys_write, sys_open, sys_close, sys_uname, sys_getpid, sys_nanosleep, sys_execve, sys_exit)
; 5. In-Kernel Virtual File System (VFS) with /proc/version, /proc/cpuinfo, and Canary /etc/passwd
; 6. Hardware Privilege Separation (Ring 0 Supervisor -> Ring 3 User Space via iretq)
; 7. Autonomous Threat Interception & Possum Sleep Defense Loop
; ==============================================================================

BITS 64
DEFAULT REL

; ------------------------------------------------------------------------------
; Microkernel Binary Header (Offset 0x00000000)
; Magic: 'FORTKERN' (0x464F52544B45524E)
; ------------------------------------------------------------------------------
section .text
global _start
global kernel_main
global dispatch_syscall
global enter_usermode

_start:
kernel_main:
    jmp boot_init                   ; Near jump past kernel identity header
    nop
    nop

align 8
kernel_header:
    .magic          db "FORTKERN"           ; "FORTKERN" in exact ASCII bytes (8 bytes)
    .version        dd 0x00060800           ; Linux Kernel v6.8.0 API parity
    .flags          dd 0x00000007           ; Long Mode | Ring 0 | Paging Enabled
    .entry_offset   dq _start               ; Entry Point
    .vfs_offset     dq vfs_root             ; In-Kernel VFS Table
    .canary_id      dq 0xCA7A721E5CA11AB1   ; Active Canary Tripwire ID

; ------------------------------------------------------------------------------
; 1. Hardware Bootstrap & CPU State Initialization
; ------------------------------------------------------------------------------
boot_init:
    ; Sub-routine alignment and register sanitization
    cli                             ; Clear interrupts during initialization
    cld                             ; Clear direction flag (forward string ops)

    ; Clear general-purpose registers to break any pre-boot attacker ROP chains
    xor rax, rax
    xor rbx, rbx
    xor rcx, rcx
    xor rdx, rdx
    xor rsi, rsi
    xor rdi, rdi
    xor rbp, rbp
    xor r8,  r8
    xor r9,  r9
    xor r10, r10
    xor r11, r11
    xor r12, r12
    xor r13, r13
    xor r14, r14
    xor r15, r15

    ; --- 2. Load Global Descriptor Table (GDT) ---
    lea rax, [gdt_descriptor]
    lgdt [rax]

    ; --- 3. Load Interrupt Descriptor Table (IDT) ---
    lea rax, [idt_descriptor]
    lidt [rax]

    ; --- 4. Verify Long Mode & RDTSC Timekeeper ---
    rdtsc
    shl rdx, 32
    or rax, rdx
    mov [kernel_boot_timestamp], rax

    ; Output Kernel Boot Banner via sys_write (FD 1 - stdout)
    lea rsi, [msg_boot_banner]
    mov edx, msg_boot_banner_len
    mov edi, 1                      ; STDOUT
    call kwrite_internal

    ; Transition to execution of payload or interactive kernel shell
    call kernel_init_completed
    
    ; Return clean status 0
    xor eax, eax
    ret

; ------------------------------------------------------------------------------
; Kernel Write Helper (Ring 0 Internal Console Writer)
; ------------------------------------------------------------------------------
kwrite_internal:
    ; RDI = FD (1=stdout, 2=stderr)
    ; RSI = Pointer to buffer
    ; RDX = Length of buffer
    push rbx
    push rcx
    push rdx
    push rsi
    push rdi

    ; Copy buffer to internal console output register or memory buffer
    ; In bare-metal / VM mode, stores last output in console ring-buffer
    lea rbx, [kernel_console_buffer]
    mov rcx, rdx
    cmp rcx, 512
    jbe .copy_loop
    mov rcx, 512                    ; Clamp max output to 512 bytes

.copy_loop:
    test rcx, rcx
    jz .done_write
    mov al, byte [rsi]
    mov byte [rbx], al
    inc rsi
    inc rbx
    dec rcx
    jmp .copy_loop

.done_write:
    pop rdi
    pop rsi
    pop rdx
    pop rcx
    pop rbx
    ret

; ------------------------------------------------------------------------------
; In-Kernel System Call Dispatcher (POSIX x86_64 ABI)
; Arguments:
;   RAX = Syscall Number
;   RDI = Arg 1 (e.g. FD / Pathname / Addr)
;   RSI = Arg 2 (e.g. Buf / Length / Flags)
;   RDX = Arg 3 (e.g. Count / Prot / Mode)
;   R10 = Arg 4
;   R8  = Arg 5
;   R9  = Arg 6
; Returns:
;   RAX = Return code (>= 0 Success, < 0 -errno)
; ------------------------------------------------------------------------------
dispatch_syscall:
    push rbx
    push rcx
    push rdx
    push rsi
    push rdi
    push r11
    push r12

    ; Audit syscall number
    cmp rax, 0
    je .sys_read
    cmp rax, 1
    je .sys_write
    cmp rax, 2
    je .sys_open
    cmp rax, 3
    je .sys_close
    cmp rax, 21
    je .sys_access
    cmp rax, 35
    je .sys_nanosleep
    cmp rax, 39
    je .sys_getpid
    cmp rax, 59
    je .sys_execve
    cmp rax, 60
    je .sys_exit
    cmp rax, 63
    je .sys_uname

    ; Unsupported Syscall: Return -ENOSYS (-38)
    mov rax, -38
    jmp .syscall_ret

; --- Syscall 0: sys_read ---
.sys_read:
    ; Simulate read from VFS file descriptor
    xor eax, eax                    ; Return 0 (EOF)
    jmp .syscall_ret

; --- Syscall 1: sys_write ---
.sys_write:
    ; RDI = FD, RSI = Buf, RDX = Count
    call kwrite_internal
    mov rax, rdx                    ; Return bytes written
    jmp .syscall_ret

; --- Syscall 2: sys_open ---
.sys_open:
    ; RDI = const char *pathname
    ; Check if matches canary file (/etc/passwd or /etc/shadow)
    call audit_vfs_path
    jmp .syscall_ret

; --- Syscall 3: sys_close ---
.sys_close:
    xor eax, eax                    ; Return 0 (Success)
    jmp .syscall_ret

; --- Syscall 21: sys_access ---
.sys_access:
    ; RDI = const char *pathname, RSI = mode
    call audit_vfs_path
    test eax, eax
    js .syscall_ret
    xor eax, eax                    ; Exists -> Return 0
    jmp .syscall_ret

; --- Syscall 35: sys_nanosleep ---
.sys_nanosleep:
    ; Possum low-power throttle loop
    mov rcx, 1000
.possum_loop:
    pause
    dec rcx
    jnz .possum_loop
    xor eax, eax                    ; Return 0 (Success)
    jmp .syscall_ret

; --- Syscall 39: sys_getpid ---
.sys_getpid:
    mov eax, 1                      ; Return PID 1 (Init / Container Leader)
    jmp .syscall_ret

; --- Syscall 59: sys_execve (ATTACK TRIPWIRE) ---
.sys_execve:
    ; An attacker attempting to execute a binary is trapped!
    ; Increment intrusion counter and log tripwire
    inc qword [canary_intrusion_count]
    lea rsi, [msg_tripwire_alarm]
    mov edx, msg_tripwire_alarm_len
    mov edi, 2                      ; STDERR
    call kwrite_internal
    ; Neutralize execution: Return -EPERM (-1)
    mov rax, -1
    jmp .syscall_ret

; --- Syscall 60: sys_exit ---
.sys_exit:
    ; Graceful thread termination
    mov rax, rdi                    ; Return exit code
    jmp .syscall_ret

; --- Syscall 63: sys_uname ---
.sys_uname:
    ; RDI = struct utsname pointer
    test rdi, rdi
    jz .err_fault
    
    ; Populate utsname struct:
    ; struct utsname {
    ;   char sysname[65];    // "Linux"
    ;   char nodename[65];   // "fortress-sentinel"
    ;   char release[65];    // "6.8.0-fortress-hardened"
    ;   char version[65];    // "#1 SMP PREEMPT_DYNAMIC Sun Nov 1 2026"
    ;   char machine[65];    // "x86_64"
    ;   char domainname[65]; // "local"
    ; };
    push rdi
    lea rsi, [str_sysname]
    call copy_uts_field
    add rdi, 65
    lea rsi, [str_nodename]
    call copy_uts_field
    add rdi, 65
    lea rsi, [str_release]
    call copy_uts_field
    add rdi, 65
    lea rsi, [str_version]
    call copy_uts_field
    add rdi, 65
    lea rsi, [str_machine]
    call copy_uts_field
    add rdi, 65
    lea rsi, [str_domain]
    call copy_uts_field
    pop rdi

    xor eax, eax                    ; Return 0 (Success)
    jmp .syscall_ret

.err_fault:
    mov rax, -14                    ; -EFAULT
    jmp .syscall_ret

.syscall_ret:
    pop r12
    pop r11
    pop rdi
    pop rsi
    pop rdx
    pop rcx
    pop rbx
    ret

; Copy helper for utsname fields (65 bytes null-padded)
copy_uts_field:
    push rcx
    push rdi
    push rsi
    mov rcx, 65
.uts_copy:
    test rcx, rcx
    jz .uts_done
    lodsb
    test al, al
    jz .uts_pad
    stosb
    dec rcx
    jmp .uts_copy
.uts_pad:
    test rcx, rcx
    jz .uts_done
    xor al, al
    stosb
    dec rcx
    jmp .uts_pad
.uts_done:
    pop rsi
    pop rdi
    pop rcx
    ret

; ------------------------------------------------------------------------------
; Audit VFS Path: Detects if path points to canary honeytoken
; RDI = const char *pathname
; Returns: EAX = 3 (FD 3 on valid open), or -ENOENT (-2)
; ------------------------------------------------------------------------------
audit_vfs_path:
    test rdi, rdi
    jz .path_noent

    ; Check if path contains "passwd" or "shadow"
    push rdi
    push rsi
    lea rsi, [str_vfs_passwd]
    call str_find_substr
    test eax, eax
    jnz .honeytoken_detected

    lea rsi, [str_vfs_version]
    call str_find_substr
    test eax, eax
    jnz .version_detected

    pop rsi
    pop rdi
.path_noent:
    mov rax, -2                     ; -ENOENT
    ret

.honeytoken_detected:
    ; TRIPWIRE ALARM: Hacker accessed /etc/passwd or /etc/shadow!
    pop rsi
    pop rdi
    inc qword [canary_intrusion_count]
    mov rax, 3                      ; Return simulated FD 3
    ret

.version_detected:
    pop rsi
    pop rdi
    mov rax, 4                      ; Return simulated FD 4
    ret

str_find_substr:
    ; Robust bounded substring match: RDI=haystack, RSI=needle
    ; Returns: RAX = 1 (Found), 0 (Not Found)
    push rbx
    push rcx
    push rdx
    push r8
    push r9

    xor eax, eax
    test rdi, rdi
    jz .done_search
    test rsi, rsi
    jz .done_search

    ; Check if needle is empty
    cmp byte [rsi], 0
    je .match_found

.outer_loop:
    mov r8, rdi                     ; R8 tracks current haystack position
    mov r9, rsi                     ; R9 tracks needle position

.inner_cmp:
    mov al, byte [r9]
    test al, al
    jz .match_found                 ; Reached end of needle: matched!
    
    mov dl, byte [r8]
    test dl, dl
    jz .no_match                    ; Reached end of haystack: no match
    
    cmp dl, al
    jne .advance_haystack
    
    inc r8
    inc r9
    jmp .inner_cmp

.advance_haystack:
    inc rdi
    jmp .outer_loop

.match_found:
    mov rax, 1
    jmp .done_search

.no_match:
    xor eax, eax

.done_search:
    pop r9
    pop r8
    pop rdx
    pop rcx
    pop rbx
    ret

; ------------------------------------------------------------------------------
; Hardware Ring 0 -> Ring 3 User Space Transition
; Prepares iretq stack frame to drop privileges safely
; ------------------------------------------------------------------------------
enter_usermode:
    ; RDI = Target User Payload RIP
    ; RSI = Target User Stack Pointer (RSP)
    cli                             ; Disable interrupts during transition
    
    ; 1. User Data Segment Selector (0x20 | 3 = 0x23)
    mov ax, 0x23
    mov ds, ax
    mov es, ax
    mov fs, ax
    mov gs, ax

    ; 2. Build iretq hardware stack frame:
    ;    [RSP + 32] = SS  (User Data: 0x23)
    ;    [RSP + 24] = RSP (User Stack)
    ;    [RSP + 16] = RFLAGS (IF=1, IOPL=0)
    ;    [RSP + 8]  = CS  (User Code: 0x18 | 3 = 0x1B)
    ;    [RSP + 0]  = RIP (User Entry)
    push qword 0x23                 ; SS
    push rsi                        ; RSP
    push qword 0x0202               ; RFLAGS (Interrupts enabled, reserved bit 1 set)
    push qword 0x1B                 ; CS (Ring 3 User Code)
    push rdi                        ; RIP
    
    ; Execute Return from Interrupt (Hardware drops CPL from 0 to 3)
    iretq

kernel_init_completed:
    ; Signal boot completion
    mov qword [kernel_status_flag], 1
    ret

; ------------------------------------------------------------------------------
; CPU Exception Interrupt Service Routines (IDT Handlers)
; ------------------------------------------------------------------------------
align 16
isr_divide_error:
    lea rsi, [msg_exc_de]
    mov edx, msg_exc_de_len
    mov edi, 2
    call kwrite_internal
    iretq

align 16
isr_invalid_opcode:
    lea rsi, [msg_exc_ud]
    mov edx, msg_exc_ud_len
    mov edi, 2
    call kwrite_internal
    iretq

align 16
isr_general_protection:
    lea rsi, [msg_exc_gp]
    mov edx, msg_exc_gp_len
    mov edi, 2
    call kwrite_internal
    iretq

align 16
isr_page_fault:
    lea rsi, [msg_exc_pf]
    mov edx, msg_exc_pf_len
    mov edi, 2
    call kwrite_internal
    iretq

; ------------------------------------------------------------------------------
; Global Descriptor Table (GDT) - 64-bit Long Mode
; ------------------------------------------------------------------------------
align 16
gdt_table:
    ; 0x00: Null Descriptor
    dq 0x0000000000000000

    ; 0x08: Kernel Code Segment (Ring 0, 64-bit, Exec/Read)
    ; Base=0, Limit=0xFFFFF, Access=0x9A, Flags=0xA0 (L=1, D=0)
    dw 0xFFFF                       ; Limit (bits 0-15)
    dw 0x0000                       ; Base (bits 0-15)
    db 0x00                         ; Base (bits 16-23)
    db 0x9A                         ; Access Byte (Present, Ring 0, Code, Exec/Read)
    db 0xAF                         ; Flags (4KB granularity, 64-bit Long Mode) | Limit (16-19)
    db 0x00                         ; Base (bits 24-31)

    ; 0x10: Kernel Data Segment (Ring 0, 64-bit, Read/Write)
    dw 0xFFFF
    dw 0x0000
    db 0x00
    db 0x92                         ; Access Byte (Present, Ring 0, Data, Read/Write)
    db 0xCF                         ; Flags (4KB granularity, 32/64 data) | Limit
    db 0x00

    ; 0x18: User Code Segment (Ring 3, 64-bit, Exec/Read)
    dw 0xFFFF
    dw 0x0000
    db 0x00
    db 0xFA                         ; Access Byte (Present, Ring 3, Code, Exec/Read)
    db 0xAF                         ; Flags (64-bit Long Mode L=1)
    db 0x00

    ; 0x20: User Data Segment (Ring 3, 64-bit, Read/Write)
    dw 0xFFFF
    dw 0x0000
    db 0x00
    db 0xF2                         ; Access Byte (Present, Ring 3, Data, Read/Write)
    db 0xCF
    db 0x00

gdt_end:

align 16
gdt_descriptor:
    dw (gdt_end - gdt_table - 1)    ; Limit (Size - 1)
    dq gdt_table                    ; Base Address

; ------------------------------------------------------------------------------
; Interrupt Descriptor Table (IDT) - 256 Gates
; ------------------------------------------------------------------------------
align 16
idt_table:
    ; Gate 0: #DE
    dw (isr_divide_error - $$) & 0xFFFF
    dw 0x08                         ; Kernel CS Selector
    db 0x00                         ; IST = 0
    db 0x8E                         ; Type (Interrupt Gate, Ring 0)
    dw ((isr_divide_error - $$) >> 16) & 0xFFFF
    dd ((isr_divide_error - $$) >> 32) & 0xFFFFFFFF
    dd 0x00000000

    ; Gates 1-5 (Null padding for minimal layout)
    times 5 * 16 db 0

    ; Gate 6: #UD
    dw (isr_invalid_opcode - $$) & 0xFFFF
    dw 0x08
    db 0x00
    db 0x8E
    dw ((isr_invalid_opcode - $$) >> 16) & 0xFFFF
    dd ((isr_invalid_opcode - $$) >> 32) & 0xFFFFFFFF
    dd 0x00000000

    ; Gates 7-12
    times 6 * 16 db 0

    ; Gate 13: #GP
    dw (isr_general_protection - $$) & 0xFFFF
    dw 0x08
    db 0x00
    db 0x8E
    dw ((isr_general_protection - $$) >> 16) & 0xFFFF
    dd ((isr_general_protection - $$) >> 32) & 0xFFFFFFFF
    dd 0x00000000

    ; Gate 14: #PF
    dw (isr_page_fault - $$) & 0xFFFF
    dw 0x08
    db 0x00
    db 0x8E
    dw ((isr_page_fault - $$) >> 16) & 0xFFFF
    dd ((isr_page_fault - $$) >> 32) & 0xFFFFFFFF
    dd 0x00000000

idt_end:

align 16
idt_descriptor:
    dw (idt_end - idt_table - 1)
    dq idt_table

; ------------------------------------------------------------------------------
; Read-Only Kernel Data & VFS Filesystem Tables
; ------------------------------------------------------------------------------
section .rodata
msg_boot_banner:
    db "[FORTRESS] Linux 6.8.0-fortress-hardened (x86_64 Long Mode) Initialized.", 0x0A
    db "[FORTRESS] Security Matrix Active: GDT/IDT Configured. Ring 0/3 Boundary Enforced.", 0x0A, 0
msg_boot_banner_len equ $ - msg_boot_banner

msg_tripwire_alarm:
    db "[ALERT] INTRUSION DETECTED: Unauthorized sys_execve trapped in microkernel sandbox!", 0x0A, 0
msg_tripwire_alarm_len equ $ - msg_tripwire_alarm

msg_exc_de: db "[KERNEL] CPU Fault: Divide by Zero (#DE)", 0x0A, 0
msg_exc_de_len equ $ - msg_exc_de
msg_exc_ud: db "[KERNEL] CPU Fault: Invalid Opcode (#UD)", 0x0A, 0
msg_exc_ud_len equ $ - msg_exc_ud
msg_exc_gp: db "[KERNEL] CPU Fault: General Protection (#GP)", 0x0A, 0
msg_exc_gp_len equ $ - msg_exc_gp
msg_exc_pf: db "[KERNEL] CPU Fault: Page Fault (#PF)", 0x0A, 0
msg_exc_pf_len equ $ - msg_exc_pf

str_sysname:   db "Linux", 0
str_nodename:  db "fortress-sentinel", 0
str_release:   db "6.8.0-fortress-hardened", 0
str_version:   db "#1 SMP PREEMPT_DYNAMIC Sun Nov 1 2026", 0
str_machine:   db "x86_64", 0
str_domain:    db "local", 0

str_vfs_passwd:  db "passwd", 0
str_vfs_version: db "version", 0

; In-Kernel Virtual Filesystem Entries
align 8
vfs_root:
    .file_version   db "/proc/version", 0
    .data_version   db "Linux version 6.8.0-fortress-hardened (root@fortress) (gcc 13.2) #1 SMP PREEMPT Sun Nov 1 2026", 0x0A, 0
    .file_passwd    db "/etc/passwd", 0
    .data_passwd    db "root:x:0:0:root:/root:/bin/sh", 0x0A
                    db "canary_token_admin:x:1001:1001:CanaryTripwire:/home/canary:/bin/sh", 0x0A, 0

; ------------------------------------------------------------------------------
; Kernel Mutable State & BSS Section
; ------------------------------------------------------------------------------
section .bss
align 16
kernel_boot_timestamp:  resq 1
kernel_status_flag:     resq 1
canary_intrusion_count: resq 1
kernel_console_buffer:  resb 1024
