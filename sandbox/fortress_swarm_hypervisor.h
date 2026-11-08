/**
 * ==============================================================================
 * FORTRESS ADVANCED CYBER DEFENSE ARSENAL (LAYER 35)
 * File: fortress_swarm_hypervisor.h
 * Target: Multi-Architecture Microkernel VM Hypervisor & Swarm Execution Engine
 * Standard: ANSI C99 / C11 Header
 * ==============================================================================
 */

#ifndef FORTRESS_SWARM_HYPERVISOR_H
#define FORTRESS_SWARM_HYPERVISOR_H

#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

/* ------------------------------------------------------------------------------
 * Supported CPU Architectures
 * ------------------------------------------------------------------------------ */
typedef enum {
    ARCH_X86_64     = 1,    /* x86_64 Long Mode (syscall / 0x0F 0x05) */
    ARCH_AARCH64    = 2,    /* ARMv8-A 64-Bit (svc #0 / 0x01 0x00 0x00 0xD4) */
    ARCH_RISCV64    = 3,    /* RISC-V 64 RV64GC (ecall / 0x73 0x00 0x00 0x00) */
    ARCH_BSD_X86    = 4     /* FreeBSD amd64 Fast Trap (int 0x80 / 0xCD 0x80) */
} fortress_arch_t;

/* ------------------------------------------------------------------------------
 * Hypervisor Execution Traps & Verdicts
 * ------------------------------------------------------------------------------ */
typedef enum {
    TRAP_OK                 = 0,
    TRAP_HALT               = 1,
    TRAP_SYS_EXECVE         = 2,    /* Hostile shellcode execve attempt */
    TRAP_CANARY_TRIPPED     = 3,    /* Virtual Honeytoken tripwire accessed */
    TRAP_PAGE_FAULT         = 4,    /* Segmentation fault / invalid access */
    TRAP_CYCLE_EXHAUSTED    = 5,    /* vCPU cycle budget exceeded (Anti-ReDoS/Loop) */
    TRAP_ILLEGAL_INSTRUCTION= 6,    /* Undefined opcode */
    TRAP_JAIL_VIOLATION     = 7     /* FreeBSD jail escape attempt */
} fortress_trap_t;

/* ------------------------------------------------------------------------------
 * Memory Constraints & System Constants
 * ------------------------------------------------------------------------------ */
#define SWARM_MAX_INSTANCES     64
#define SWARM_GUEST_RAM_SIZE    (16 * 1024 * 1024)  /* 16 MB per sandbox */
#define SWARM_DEFAULT_CYCLES    500000              /* 500k cycles max per slice */
#define SWARM_MAX_VFS_ENTRIES   32

/* ------------------------------------------------------------------------------
 * Polymorphic vCPU Register Bank (Universal 64-bit abstractions)
 * ------------------------------------------------------------------------------ */
typedef struct {
    uint64_t r[32];         /* x86: rax-r15 | ARM: x0-x30 | RISC-V: x0-x31 */
    uint64_t pc;            /* rip / pc */
    uint64_t sp;            /* rsp / sp */
    uint64_t flags;         /* rflags / pstate / sstatus */
} fortress_reg_bank_t;

/* ------------------------------------------------------------------------------
 * Virtual File System Entry (In-Memory Canary Files)
 * ------------------------------------------------------------------------------ */
typedef struct {
    char path[128];
    char content[512];
    bool is_canary;
} fortress_vfs_file_t;

/* ------------------------------------------------------------------------------
 * Micro-vCPU Instance Context
 * ------------------------------------------------------------------------------ */
typedef struct {
    char handle_id[48];
    char client_ip[46];
    fortress_arch_t arch;
    fortress_reg_bank_t regs;
    uint8_t *ram_base;
    size_t ram_size;
    uint64_t cycle_budget;
    uint64_t cycles_consumed;
    fortress_trap_t last_trap;
    bool is_jailed;
    bool active;
    uint64_t spawned_at;
    uint64_t expires_at;
    fortress_vfs_file_t vfs[SWARM_MAX_VFS_ENTRIES];
    size_t vfs_count;
} fortress_vcpu_instance_t;

/* ------------------------------------------------------------------------------
 * Multi-Architecture Hypervisor Supervisor
 * ------------------------------------------------------------------------------ */
typedef struct {
    fortress_vcpu_instance_t instances[SWARM_MAX_INSTANCES];
    size_t active_count;
    uint64_t total_spawns;
    uint64_t total_detonations;
    uint64_t total_canary_trips;
    uint64_t total_cycles_executed;
} fortress_swarm_hypervisor_t;

/* ------------------------------------------------------------------------------
 * Exported Hypervisor API Functions
 * ------------------------------------------------------------------------------ */
void fortress_hypervisor_init(fortress_swarm_hypervisor_t *hyp);
void fortress_hypervisor_destroy(fortress_swarm_hypervisor_t *hyp);

fortress_vcpu_instance_t* fortress_hypervisor_spawn(
    fortress_swarm_hypervisor_t *hyp,
    fortress_arch_t arch,
    const char *client_ip,
    uint32_t ttl_seconds
);

fortress_trap_t fortress_hypervisor_dispatch_cmd(
    fortress_vcpu_instance_t *vcpu,
    const char *command,
    char *output_buf,
    size_t output_buf_len
);

fortress_trap_t fortress_hypervisor_detonate_bytecode(
    fortress_vcpu_instance_t *vcpu,
    const uint8_t *bytecode,
    size_t len
);

int fortress_hypervisor_detonate_all_arches(
    fortress_swarm_hypervisor_t *hyp,
    const uint8_t *bytecode,
    size_t len,
    fortress_trap_t results_out[4]
);

#ifdef __cplusplus
}
#endif

#endif /* FORTRESS_SWARM_HYPERVISOR_H */
