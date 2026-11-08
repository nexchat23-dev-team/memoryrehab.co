/**
 * ==============================================================================
 * FORTRESS SOVEREIGN DEFENSE - LAYER 30 PEB & DEBUGGER SCANNER (C99)
 * File: sandbox/fortress_peb_scanner.c
 * Target Standard: ANSI C99 / Windows API
 * Compiler Compatibility: MSVC (cl.exe), MinGW-w64, Clang
 * ==============================================================================
 * Purpose:
 *   Performs deep, low-level inspection of Windows x64 TEB/PEB internal structures
 *   and CPU hardware debug registers (DR0 - DR3) to identify attached debuggers
 *   (e.g., x64dbg, WinDbg, IDA Pro, Cheat Engine) without calling IsDebuggerPresent.
 * ==============================================================================
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>

#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <winternl.h>

/* Windows x64 PEB Definitions */
#ifndef FLG_HEAP_ENABLE_TAIL_CHECK
    #define FLG_HEAP_ENABLE_TAIL_CHECK   0x10
#endif
#ifndef FLG_HEAP_ENABLE_FREE_CHECK
    #define FLG_HEAP_ENABLE_FREE_CHECK   0x20
#endif
#ifndef FLG_HEAP_VALIDATE_PARAMETERS
    #define FLG_HEAP_VALIDATE_PARAMETERS 0x40
#endif

typedef struct {
    bool being_debugged;
    uint32_t nt_global_flag;
    bool debug_heap_flags;
    bool hardware_breakpoints_set;
    uint64_t dr0, dr1, dr2, dr3;
    bool overall_verdict;
} PebAuditReport;

/* Reads the 64-bit PEB pointer directly from GS:[0x60] */
static void* get_peb_address(void) {
#if defined(_MSC_VER)
    return (void*)__readgsqword(0x60);
#elif defined(__GNUC__) || defined(__clang__)
    void* peb = NULL;
    __asm__ volatile("movq %%gs:0x60, %0" : "=r"(peb));
    return peb;
#else
    return NULL;
#endif
}

/* Performs deep PEB & hardware audit */
static PebAuditReport audit_peb_and_hardware(void) {
    PebAuditReport r = {0};
    uint8_t* peb = (uint8_t*)get_peb_address();

    if (!peb) {
        printf("[-] PEB pointer could not be determined (Non-Windows or 32-bit).\n");
        return r;
    }

    /* 1. Audit BeingDebugged (PEB + 0x02) */
    r.being_debugged = (peb[2] == 1);

    /* 2. Audit NtGlobalFlag (PEB + 0xBC) */
    uint32_t nt_flag = *(uint32_t*)(peb + 0xBC);
    r.nt_global_flag = nt_flag;
    if ((nt_flag & (FLG_HEAP_ENABLE_TAIL_CHECK | FLG_HEAP_ENABLE_FREE_CHECK | FLG_HEAP_VALIDATE_PARAMETERS)) == 0x70) {
        r.debug_heap_flags = true;
    }

    /* 3. Audit Hardware Breakpoint Registers (DR0, DR1, DR2, DR3) */
    CONTEXT ctx;
    memset(&ctx, 0, sizeof(ctx));
    ctx.ContextFlags = CONTEXT_DEBUG_REGISTERS;

    HANDLE hThread = GetCurrentThread();
    if (GetThreadContext(hThread, &ctx)) {
        r.dr0 = ctx.Dr0;
        r.dr1 = ctx.Dr1;
        r.dr2 = ctx.Dr2;
        r.dr3 = ctx.Dr3;

        if (ctx.Dr0 != 0 || ctx.Dr1 != 0 || ctx.Dr2 != 0 || ctx.Dr3 != 0) {
            r.hardware_breakpoints_set = true;
        }
    }

    r.overall_verdict = (r.being_debugged || r.debug_heap_flags || r.hardware_breakpoints_set);
    return r;
}

int main(void) {
    printf("==================================================================\n");
    printf("🔍 FORTRESS LOW-LEVEL PEB & HARDWARE BREAKPOINT AUDITOR (C99)\n");
    printf("==================================================================\n");

    void* peb_addr = get_peb_address();
    printf("[+] Target Process PID:          %lu\n", GetCurrentProcessId());
    printf("[+] Thread Environment Block:    GS:[0x30]\n");
    printf("[+] Process Environment Block:   %p (GS:[0x60])\n\n", peb_addr);

    printf("[*] Executing Anti-Analysis Checks...\n");
    PebAuditReport report = audit_peb_and_hardware();

    printf("    [1] PEB.BeingDebugged (Offset +0x02):    %s (Raw: 0x%02X)\n",
           report.being_debugged ? "DETECTED [DEBUGGER ATTACHED]" : "CLEAN (0x00)",
           report.being_debugged ? 1 : 0);

    printf("    [2] PEB.NtGlobalFlag (Offset +0xBC):     0x%08X %s\n",
           report.nt_global_flag,
           report.debug_heap_flags ? "[DEBUG HEAP ARMED (0x70)]" : "[CLEAN]");

    printf("    [3] Hardware Breakpoints (DR0-DR3):\n");
    printf("        -> DR0: 0x%016llX %s\n", (unsigned long long)report.dr0, report.dr0 ? "[BREAKPOINT HOOKED]" : "");
    printf("        -> DR1: 0x%016llX %s\n", (unsigned long long)report.dr1, report.dr1 ? "[BREAKPOINT HOOKED]" : "");
    printf("        -> DR2: 0x%016llX %s\n", (unsigned long long)report.dr2, report.dr2 ? "[BREAKPOINT HOOKED]" : "");
    printf("        -> DR3: 0x%016llX %s\n", (unsigned long long)report.dr3, report.dr3 ? "[BREAKPOINT HOOKED]" : "");

    printf("\n==================================================================\n");
    if (report.overall_verdict) {
        printf("🚨 VERDICT: ACTIVE DEBUGGER OR HARDWARE BREAKPOINTS DETECTED!\n");
        printf("   FORTRESS Recommendation: Engage Possum Sleep / Feigned Crash.\n");
    } else {
        printf("✅ VERDICT: HOST ENVIRONMENT VERIFIED CLEAN (No Debugger Present).\n");
    }
    printf("==================================================================\n");

    return report.overall_verdict ? 1 : 0;
}
#else
int main(void) {
    printf("[-] fortress_peb_scanner is a Windows-specific low-level diagnostic tool.\n");
    printf("[+] When running on POSIX/Linux, use ptrace(PTRACE_TRACEME) checks.\n");
    return 0;
}
#endif
