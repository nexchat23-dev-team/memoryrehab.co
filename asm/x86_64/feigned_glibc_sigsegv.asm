; ==============================================================================
; FORTRESS SOVEREIGN DEFENSE - LAYER 30 ASM ARSENAL
; File: asm/x86_64/feigned_glibc_sigsegv.asm
; Target: Linux x86_64 (ELF64)
; Assembler: NASM (Netwide Assembler) - Intel Syntax
; Function: Native "Pretend-to-Fall" Glibc Crash & Core Dump Simulator
; ==============================================================================
; Description:
;   Emits authentic Linux glibc memory corruption backtrace directly to stderr
;   (FD 2) using direct Linux kernel syscalls (sys_write), followed by a
;   controlled SIGSEGV/SIGABRT termination via sys_kill or sys_exit_group(139).
;   Zero JavaScript/Node.js footprint exists at the binary level.
; ==============================================================================

BITS 64
DEFAULT REL

section .rodata
    crash_msg: 
        db "*** Error in `./web-service': double free or corruption (fasttop): 0x00007ffcb49a21e0 ***", 0x0a
        db "======= Backtrace: =========", 0x0a
        db "/lib/x86_64-linux-gnu/libc.so.6(+0x8892f)[0x7fa2c108892f]", 0x0a
        db "/lib/x86_64-linux-gnu/libc.so.6(+0x89796)[0x7fa2c1089796]", 0x0a
        db "/lib/x86_64-linux-gnu/libc.so.6(+0x8c1b2)[0x7fa2c108c1b2]", 0x0a
        db "./web-service(+0x2e41)[0x55d9e8412e41]", 0x0a
        db "/lib/x86_64-linux-gnu/libc.so.6(__libc_start_main+0xf3)[0x7fa2c1029083]", 0x0a
        db "./web-service(+0x10fa)[0x55d9e84110fa]", 0x0a
        db "======= Memory map: ========", 0x0a
        db "55d9e8410000-55d9e8414000 r-xp 00000000 08:01 1928471   /usr/bin/web-service", 0x0a
        db "7fa2c1000000-7fa2c1200000 r-xp 00000000 08:01 4192831   /lib/x86_64-linux-gnu/libc-2.35.so", 0x0a
        db "7ffcb4980000-7ffcb49a5000 rw-p 00000000 00:00 0         [stack]", 0x0a
        db "7ffcb49fe000-7ffcb4a02000 r-xp 00000000 00:00 0         [vdso]", 0x0a
        db "Aborted (core dumped)", 0x0a
    CRASH_LEN equ $ - crash_msg

section .text
global _start

_start:
    ; --------------------------------------------------------------------------
    ; STEP 1: Output Authentic Crash Frame to Stderr (FD 2)
    ; --------------------------------------------------------------------------
    ; sys_write (RAX = 1, RDI = 2 [stderr], RSI = crash_msg, RDX = CRASH_LEN)
    xor rax, rax
    inc al                  ; RAX = 1 (sys_write)
    xor rdi, rdi
    mov dil, 2              ; RDI = 2 (stderr)
    lea rsi, [crash_msg]    ; RSI = address of crash message
    mov rdx, CRASH_LEN      ; RDX = length of crash message
    syscall

    ; --------------------------------------------------------------------------
    ; STEP 2: Optional Flush & Microsecond Sleep (Decoy Latency)
    ; --------------------------------------------------------------------------
    ; sys_nanosleep (RAX = 35) to mimic OS core dumping to disk
    ; struct timespec { tv_sec = 0, tv_nsec = 50000000 } (50ms)
    push qword 50000000     ; tv_nsec = 50ms
    push qword 0            ; tv_sec = 0s
    mov rdi, rsp            ; RDI = req
    xor rsi, rsi            ; RSI = rem = NULL
    xor rax, rax
    mov al, 35              ; RAX = 35 (sys_nanosleep)
    syscall
    add rsp, 16             ; Restore stack

    ; --------------------------------------------------------------------------
    ; STEP 3: Authentic Signal 11 (SIGSEGV) / Signal 6 (SIGABRT) Exit
    ; --------------------------------------------------------------------------
    ; Exit status for SIGSEGV is conventionally 128 + 11 = 139
    ; sys_exit_group = 231 (0xe7)
    xor rax, rax
    mov al, 231             ; RAX = 231 (sys_exit_group)
    xor rdi, rdi
    mov dil, 139            ; RDI = 139 (WTERMSIG = 11 SIGSEGV)
    syscall

    ; Fallback in case sys_exit_group is blocked by seccomp
    hlt
