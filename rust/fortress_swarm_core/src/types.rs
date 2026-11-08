//! ==============================================================================
//! FORTRESS LAYER 35: SWARM OS TYPES & ARCHITECTURE SPECIFICATIONS
//! ==============================================================================

use serde::{Deserialize, Serialize};

/// Supported polymorphic CPU architectures within the Swarm
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum SwarmArch {
    #[serde(rename = "x86_64-fortress")]
    X86_64Fortress,
    #[serde(rename = "arm64-sentinel")]
    Arm64Sentinel,
    #[serde(rename = "riscv64-enclave")]
    Riscv64Enclave,
    #[serde(rename = "bsd-hardened-jail")]
    BsdHardenedJail,
}

impl SwarmArch {
    pub fn as_str(&self) -> &'static str {
        match self {
            SwarmArch::X86_64Fortress => "x86_64-fortress",
            SwarmArch::Arm64Sentinel => "arm64-sentinel",
            SwarmArch::Riscv64Enclave => "riscv64-enclave",
            SwarmArch::BsdHardenedJail => "bsd-hardened-jail",
        }
    }

    pub fn kernel_magic(&self) -> &'static str {
        match self {
            SwarmArch::X86_64Fortress => "FORTKERN_X64",
            SwarmArch::Arm64Sentinel => "FORTKERN_A64",
            SwarmArch::Riscv64Enclave => "FORTKERN_R64",
            SwarmArch::BsdHardenedJail => "FORTKERN_BSD",
        }
    }

    pub fn syscall_opcode_hex(&self) -> &'static str {
        match self {
            SwarmArch::X86_64Fortress => "0f05",
            SwarmArch::Arm64Sentinel => "010000d4",
            SwarmArch::Riscv64Enclave => "73000000",
            SwarmArch::BsdHardenedJail => "cd80",
        }
    }

    pub fn os_release_string(&self) -> &'static str {
        match self {
            SwarmArch::X86_64Fortress => {
                "Linux 6.8.0-fortress-hardened #1 SMP PREEMPT_DYNAMIC Sun Nov 1 2026 x86_64 GNU/Linux"
            }
            SwarmArch::Arm64Sentinel => {
                "Linux 6.8.0-sentinel-arm64 #4 SMP PREEMPT Sun Nov 1 2026 aarch64 GNU/Linux"
            }
            SwarmArch::Riscv64Enclave => {
                "RISC-V Hardened Microkernel v2.1-enclave riscv64 GNU/Linux"
            }
            SwarmArch::BsdHardenedJail => {
                "FreeBSD 14.1-RELEASE-FORTRESS #0 r373510: Sun Nov 1 2026 amd64"
            }
        }
    }
}

/// Execution trap outcomes from sandboxed virtual execution
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum TrapVerdict {
    SafeExecution { cycles_used: u64 },
    HostileSysExecve { reason: String, cycles_used: u64 },
    HostileSupervisorCall { reason: String, cycles_used: u64 },
    HostileEcallEscalation { reason: String, cycles_used: u64 },
    HoneytokenTripped { path: String, canary_token: String },
    CycleBudgetExceeded { limit: u64 },
    MemorySegmentationFault { address: u64 },
}

impl TrapVerdict {
    pub fn is_hostile(&self) -> bool {
        matches!(
            self,
            TrapVerdict::HostileSysExecve { .. }
                | TrapVerdict::HostileSupervisorCall { .. }
                | TrapVerdict::HostileEcallEscalation { .. }
                | TrapVerdict::HoneytokenTripped { .. }
        )
    }
}

/// 64-bit universal hardware register bank
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegisterBank {
    pub pc: u64,
    pub sp: u64,
    pub flags: u64,
    pub gpr: [u64; 32],
}

impl Default for RegisterBank {
    fn default() -> Self {
        Self {
            pc: 0x0000000000401000,
            sp: 0x00007ffcb49a2000,
            flags: 0x0000000000000202,
            gpr: [0u64; 32],
        }
    }
}
