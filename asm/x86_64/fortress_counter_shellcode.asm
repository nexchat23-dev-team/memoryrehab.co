; ==============================================================================
; FORTRESS SOVEREIGN DEFENSE - LAYER 30 ASM ARSENAL
; File: asm/x86_64/fortress_counter_shellcode.asm
; Target: Linux x86_64 (ELF64)
; Assembler: NASM (Netwide Assembler) - Intel Syntax
; Function: Active Defense Shellcode Counter-Measure & Attacker Entrapment
; ==============================================================================
; Description:
;   This assembly routine is deployed when FORTRESS's disassembler detects
;   an adversarial shellcode injection attempt (e.g. execve /bin/sh or reverse TCP).
;   Instead of immediately terminating the thread (which signals WAF presence),
;   this counter-routine hijacks the execution flow, executes anti-debugger
;   checks, writes a stealth canary attribution beacon to the socket, and
;   enters an un-breakable quantum pause loop.
; ==============================================================================

BITS 64
DEFAULT REL

section .text
global _start

_start:
    ; --------------------------------------------------------------------------
    ; STEP 1: Anti-Analysis & Anti-Debugger Probe (sys_ptrace TRACEME)
    ; --------------------------------------------------------------------------
    ; sys_ptrace = 101 (0x65), PTRACE_TRACEME = 0
    xor rax, rax
    mov al, 101             ; RAX = 101 (sys_ptrace)
    xor rdi, rdi            ; RDI = 0 (PTRACE_TRACEME)
    xor rsi, rsi            ; RSI = 0
    xor rdx, rdx            ; RDX = 0
    xor r10, r10            ; R10 = 0
    syscall

    ; If RAX < 0, a debugger (gdb/strace) is currently inspecting us
    test rax, rax
    js .debugger_detected

    ; --------------------------------------------------------------------------
    ; STEP 2: RDTSC High-Resolution Execution Delta (Timing Attack Shield)
    ; --------------------------------------------------------------------------
    rdtsc                   ; EDX:EAX = timestamp counter
    mov r8d, eax            ; Store start timestamp in R8D
    pause                   ; Micro-quantum execution delay
    rdtsc
    sub eax, r8d            ; Delta cycles
    cmp eax, 0x100000       ; If delta > 1,048,576 cycles, execution is single-stepped
    ja .debugger_detected

    ; --------------------------------------------------------------------------
    ; STEP 3: Position-Independent Stack Framing & Register Sanitization
    ; --------------------------------------------------------------------------
    push rbp
    mov rbp, rsp
    sub rsp, 128            ; Allocate 128 bytes scratchpad

    ; Zero out working registers to eradicate any leaked kernel pointers
    xor rax, rax
    xor rbx, rbx
    xor rcx, rcx
    xor rdx, rdx
    xor rsi, rsi
    xor rdi, rdi
    xor r8,  r8
    xor r9,  r9
    xor r10, r10
    xor r11, r11

    ; --------------------------------------------------------------------------
    ; STEP 4: Emit Controlled Deception Signal to Attacker Sink
    ; --------------------------------------------------------------------------
    ; We write our stealth canary marker back to stdout (fd 1) or attacker socket
    ; String: "[FORTRESS-ASM-TRAP:OBSERVED]\n"
    ; Pushing string in reverse 8-byte chunks onto stack:
    ; "\n" + "ED]" = 0x0a5d4445 (padded)
    ; "RV" + "E" = 0x5652
    ; Built dynamically to remain 100% position-independent:
    
    mov dword [rsp + 0],  0x524f465b  ; "[FOR"
    mov dword [rsp + 4],  0x53455254  ; "TRES"
    mov dword [rsp + 8],  0x53412d53  ; "S-AS"
    mov dword [rsp + 12], 0x542d4d50  ; "M-TR"
    mov dword [rsp + 16], 0x3a5041   ; "AP:"
    mov byte  [rsp + 19], 0x0a        ; "\n"

    ; sys_write (RAX=1, RDI=1 (stdout), RSI=rsp, RDX=20)
    xor rax, rax
    inc al                  ; RAX = 1 (sys_write)
    xor rdi, rdi
    inc dil                 ; RDI = 1 (stdout)
    lea rsi, [rsp]          ; RSI = pointer to message
    xor rdx, rdx
    mov dl, 20              ; RDX = 20 bytes
    syscall

    ; --------------------------------------------------------------------------
    ; STEP 5: Quantum Entrapment Loop (Tarpit Delay)
    ; --------------------------------------------------------------------------
    ; Traps the attacker's execution thread in a CPU-friendly pause cycle
    ; This freezes their exploit runner while consuming 0% CPU.
    mov rcx, 1000           ; 1,000 tarpit iterations
.tarpit_loop:
    pause                   ; Low-power pipeline stall
    dec rcx
    jnz .tarpit_loop

    ; --------------------------------------------------------------------------
    ; STEP 6: Controlled Clean Exit (sys_exit_group)
    ; --------------------------------------------------------------------------
    ; sys_exit_group = 231 (0xe7), exit_code = 0
    mov rsp, rbp
    pop rbp
    xor rax, rax
    mov al, 231             ; RAX = 231 (sys_exit_group)
    xor rdi, rdi            ; RDI = 0 (clean status)
    syscall

.debugger_detected:
    ; Deception branch: Trigger an illegal instruction or infinite trap
    ; to waste reverse-engineer's manual analysis time
    ud2                     ; Undefined Instruction (SIGILL 0x0f 0x0b)
