/* ==============================================================================
 * FORTRESS SOVEREIGN DEFENSE - LAYER 30 ASM ARSENAL
 * File: asm/arm64/aarch64_counter_trap.s
 * Target: Linux AArch64 (ARM 64-bit ELF)
 * Assembler: GNU Assembler (GAS) / Clang LLVM - Standard ARM Syntax
 * Function: Native AArch64 Active Counter & Possum Lure Routine
 * ==============================================================================
 * Description:
 *   Native 64-bit ARM counter-routine for cloud ARM instances (e.g. AWS Graviton,
 *   Oracle Ampere, Apple Silicon containers).
 *   Intercepts hijacked execution vectors, outputs a synthetic kernel abort
 *   frame to stderr, and halts the execution thread via Linux AArch64 svc #0.
 * ==============================================================================
 */

.arch armv8-a
.text
.align 2
.global _start

_start:
    // --------------------------------------------------------------------------
    // STEP 1: Position-Independent String Resolution via ADR
    // --------------------------------------------------------------------------
    // In ARM64, ADR calculates PC-relative addresses within +/- 1MB without relocations
    adr     x1, abort_msg           // X1 = pointer to abort message buffer
    mov     x2, #abort_msg_len      // X2 = length of message

    // --------------------------------------------------------------------------
    // STEP 2: sys_write to STDERR (FD 2) via svc #0
    // AArch64 Syscall Convention:
    //   X8 = Syscall number (__NR_write = 64)
    //   X0 = File descriptor (2 = stderr)
    //   X1 = Buffer pointer
    //   X2 = Count
    // --------------------------------------------------------------------------
    mov     x0, #2                  // X0 = 2 (stderr)
    mov     x8, #64                 // X8 = 64 (sys_write)
    svc     #0                      // Linux AArch64 Supervisor Call

    // --------------------------------------------------------------------------
    // STEP 3: Decoy Sleep Frame (Pretend-to-Fall Latency)
    // Allocate struct timespec on stack: { tv_sec = 0, tv_nsec = 100000000 (100ms) }
    // --------------------------------------------------------------------------
    sub     sp, sp, #16             // Allocate 16 bytes on stack
    str     xzr, [sp, #0]           // tv_sec = 0
    movz    x3, #0x5f5e, lsl #0     // 100,000,000 ns = 0x05f5e100
    movk    x3, #0x05f5, lsl #16
    str     x3, [sp, #8]            // tv_nsec = 100ms

    mov     x0, sp                  // X0 = pointer to timespec req
    mov     x1, #0                  // X1 = rem = NULL
    mov     x8, #101                // X8 = 101 (sys_nanosleep)
    svc     #0

    add     sp, sp, #16             // Restore stack

    // --------------------------------------------------------------------------
    // STEP 4: Controlled Process Exit (__NR_exit_group = 94, or __NR_exit = 93)
    // Exit code: 139 (SIGSEGV signal 11)
    // --------------------------------------------------------------------------
    mov     x0, #139                // X0 = 139 (Simulated SIGSEGV core dump)
    mov     x8, #94                 // X8 = 94 (sys_exit_group)
    svc     #0

    // Fallback infinite trap
1:  wfi                             // Wait For Interrupt (low power CPU sleep)
    b       1b                      // Branch back if woken

.align 3
abort_msg:
    .ascii "kernel: [  184.910245] web-service[2104]: unhandled level 2 translation fault (11) at 0x0000ffff8291a000, esr 0x92000006\n"
    .ascii "Segmentation fault (core dumped)\n"
abort_msg_end:
    .equ abort_msg_len, abort_msg_end - abort_msg
