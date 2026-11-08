; ==============================================================================
; FORTRESS SOVEREIGN DEFENSE - LAYER 30 ASM ARSENAL
; File: asm/x86/possum_sleep_trap.asm
; Target: Linux x86 (IA-32 ELF)
; Assembler: NASM (Netwide Assembler) - Intel Syntax
; Function: 100% NULL-BYTE FREE "Pretend-to-Fall" Possum Sleep Shellcode Trap
; ==============================================================================
; Description:
;   This 32-bit x86 shellcode counter-routine contains ZERO NULL BYTES (0x00),
;   making it capable of traversing vulnerable C string buffers (strcpy, sprintf).
;   When executed by a hijacked instruction pointer, it puts the execution
;   thread into an un-wakeable possum state (sys_pause / sys_nanosleep) while
;   emitting zero alarms to the attacker.
; ==============================================================================

BITS 32

section .text
global _start

_start:
    ; --------------------------------------------------------------------------
    ; STEP 1: Clear registers without introducing null bytes (0x00)
    ; --------------------------------------------------------------------------
    xor eax, eax            ; EAX = 0 (Opcode: 31 c0)
    xor ebx, ebx            ; EBX = 0 (Opcode: 31 db)
    xor ecx, ecx            ; ECX = 0 (Opcode: 31 c9)
    xor edx, edx            ; EDX = 0 (Opcode: 31 d2)

    ; --------------------------------------------------------------------------
    ; STEP 2: Craft Timespec on Stack Without Null Bytes
    ; struct timespec { time_t tv_sec; long tv_nsec; }
    ; Target sleep duration: 300 seconds (0x012c)
    ; --------------------------------------------------------------------------
    push edx                ; tv_nsec = 0 (push 4 null bytes cleanly)
    mov bx, 0x012c          ; EBX = 300 (No null byte in word move)
    push ebx                ; tv_sec = 300
    mov ebx, esp            ; EBX = pointer to timespec struct (arg1)

    ; --------------------------------------------------------------------------
    ; STEP 3: Invoke sys_nanosleep (Linux x86 syscall 162 = 0xa2)
    ; EAX = 162 (sys_nanosleep)
    ; EBX = pointer to req struct
    ; ECX = NULL (rem)
    ; --------------------------------------------------------------------------
    mov al, 0xa2            ; EAX = 162 (single byte mov, 0 nulls)
    xor ecx, ecx            ; ECX = 0 (NULL)
    int 0x80                ; Execute syscall (Opcode: cd 80)

    ; --------------------------------------------------------------------------
    ; STEP 4: Possum Fallback - sys_pause (Linux x86 syscall 29 = 0x1d)
    ; If nanosleep interrupted, pause indefinitely awaiting signal
    ; --------------------------------------------------------------------------
.possum_pause:
    xor eax, eax
    mov al, 0x1d            ; EAX = 29 (sys_pause)
    int 0x80                ; Execute syscall

    ; --------------------------------------------------------------------------
    ; STEP 5: Controlled Quiet Exit (sys_exit = 1)
    ; --------------------------------------------------------------------------
    xor eax, eax
    inc eax                 ; EAX = 1 (sys_exit)
    xor ebx, ebx            ; EBX = 0 (Exit status 0)
    int 0x80
