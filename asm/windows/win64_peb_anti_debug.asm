; ==============================================================================
; FORTRESS ADVANCED CYBER DEFENSE ARSENAL (TAB 30)
; File: win64_peb_anti_debug.asm
; Target Architecture: Windows x64 (AMD64 / Intel 64)
; Assembler: NASM (Intel Syntax)
; Calling Convention: Microsoft x64 FastCall
; Purpose: Native Windows x64 Process Environment Block (PEB) Anti-Debugging,
;          NtGlobalFlag Inspection, and Low-Power Possum Defense Trap.
; ==============================================================================

BITS 64
DEFAULT REL

section .text
global _start
global CheckDebuggerAndDefend

; ------------------------------------------------------------------------------
; Entry Point: _start
; ------------------------------------------------------------------------------
_start:
    ; Sub-routine call with 16-byte shadow space alignment
    sub rsp, 40                     ; 32 bytes shadow space + 8 bytes alignment
    call CheckDebuggerAndDefend
    add rsp, 40
    
    ; Exit gracefully
    xor ecx, ecx                    ; Exit code 0
    ret

; ------------------------------------------------------------------------------
; CheckDebuggerAndDefend:
;   Audits PEB for BeingDebugged, NtGlobalFlag (0x70), and ProcessHeap flags.
;   Returns: RAX = 0 (Clean), RAX = 1 (Debugger Detected & Neutralized)
; ------------------------------------------------------------------------------
CheckDebuggerAndDefend:
    push rbx
    push rdi
    push rsi
    push r12
    push r13

    ; --- 1. Query Process Environment Block (PEB) from TEB ---
    ; In Windows 64-bit:
    ;   GS:[0x30] = Pointer to TEB (Thread Environment Block)
    ;   TEB + 0x60 = Pointer to PEB (Process Environment Block)
    ; Alternatively, GS:[0x60] directly indexes the PEB pointer.
    mov rax, qword [gs:0x60]        ; RAX = &PEB
    test rax, rax
    jz .clean_exit                  ; If PEB is NULL (e.g. running in emulated hypervisor), pass safely

    ; --- 2. Check 1: PEB.BeingDebugged (Offset +0x02, 1 Byte) ---
    ; When a debugger attaches via CreateProcess(DEBUG_PROCESS) or DebugActiveProcess,
    ; the Windows kernel immediately sets this byte to 1.
    movzx ebx, byte [rax + 0x02]    ; EBX = BeingDebugged
    cmp bl, 1
    je .debugger_tripped

    ; --- 3. Check 2: PEB.NtGlobalFlag (Offset +0xBC, 4 Bytes) ---
    ; When started under a debugger, Windows initializes heaps with:
    ;   FLG_HEAP_ENABLE_TAIL_CHECK   = 0x10
    ;   FLG_HEAP_ENABLE_FREE_CHECK   = 0x20
    ;   FLG_HEAP_VALIDATE_PARAMETERS = 0x40
    ; Combined mask: 0x10 | 0x20 | 0x40 = 0x70
    mov edx, dword [rax + 0xBC]     ; EDX = NtGlobalFlag
    and edx, 0x70                   ; Mask debug heap flags
    cmp edx, 0x70
    je .debugger_tripped

    ; --- 4. Check 3: PEB.ProcessHeaps (Offset +0x18 -> Flags & ForceFlags) ---
    ; Default ProcessHeap pointer is at PEB + 0x18 (or 0x30 in some Windows builds)
    mov rcx, qword [rax + 0x18]     ; RCX = Default ProcessHeap
    test rcx, rcx
    jz .check_timing

    ; In Windows 64-bit, Heap.Flags is at +0x70 (or +0x74), Heap.ForceFlags is at +0x74
    ; Non-debugged heap: Flags == 0x00000002 (HEAP_GROWABLE), ForceFlags == 0
    ; Debugged heap: Flags has extra debug bits, ForceFlags != 0
    mov esi, dword [rcx + 0x74]     ; ESI = ForceFlags
    test esi, esi
    jnz .debugger_tripped

.check_timing:
    ; --- 5. Check 4: CPU Cycle Variance (RDTSC Anti-Single-Step) ---
    rdtsc                           ; EDX:EAX = timestamp counter
    mov r12d, eax                   ; R12D = initial cycle count

    ; Minor mathematical work
    xor edi, edi
    mov ecx, 100
.timing_loop:
    add edi, ecx
    loop .timing_loop

    rdtsc                           ; EDX:EAX = second timestamp
    sub eax, r12d                   ; EAX = cycle delta
    cmp eax, 0x000fffff             ; Over ~1M cycles indicates manual single-stepping
    ja .debugger_tripped

.clean_exit:
    ; System is clean: return 0 (no debugger)
    xor eax, eax
    pop r13
    pop r12
    pop rsi
    pop rdi
    pop rbx
    ret

.debugger_tripped:
    ; --- 6. Deception & Possum Defense Trap ---
    ; When a debugger or reverse-engineering tool is caught:
    ; Do not crash immediately (which alerts the analyst).
    ; Instead, enter a low-power CPU pause state or clear all registers.
    xor eax, eax
    xor ebx, ebx
    xor ecx, ecx
    xor edx, edx
    xor esi, esi
    xor edi, edi

    ; Possum low-power loop (32 iterations)
    mov ecx, 32
.possum_drip:
    pause                           ; Low-power spin-wait hint to CPU pipeline
    dec ecx
    jnz .possum_drip

    ; Return 1 indicating defense engaged
    mov eax, 1
    pop r13
    pop r12
    pop rsi
    pop rdi
    pop rbx
    ret
