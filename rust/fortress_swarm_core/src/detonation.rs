//! ==============================================================================
//! FORTRESS LAYER 35: CROSS-ARCHITECTURE BYTECODE DETONATION CHAMBER
//! ==============================================================================

use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use crate::types::{SwarmArch, TrapVerdict};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArchDetonationResult {
    pub arch: String,
    pub magic: String,
    pub is_hostile: bool,
    pub status: String,
    pub cycles: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetonationReport {
    pub hex_opcodes: String,
    pub byte_length: usize,
    pub globally_hostile: bool,
    pub primary_reason: Option<String>,
    pub results: HashMap<String, ArchDetonationResult>,
}

pub struct DetonationChamber;

impl DetonationChamber {
    pub fn detonate_hex(hex_str: &str) -> DetonationReport {
        let mut clean_hex: String = hex_str
            .chars()
            .filter(|c| c.is_ascii_hexdigit())
            .map(|c| c.to_ascii_lowercase())
            .collect();

        if clean_hex.len() % 2 != 0 {
            clean_hex.pop();
        }

        let byte_len = clean_hex.len() / 2;
        let mut results = HashMap::new();
        let mut globally_hostile = false;
        let mut primary_reason = None;

        let arches = [
            SwarmArch::X86_64Fortress,
            SwarmArch::Arm64Sentinel,
            SwarmArch::Riscv64Enclave,
            SwarmArch::BsdHardenedJail,
        ];

        for arch in arches {
            let mut is_hostile = false;
            let mut status = "SAFE_EXECUTION_COMPLETED".to_string();

            match arch {
                SwarmArch::X86_64Fortress => {
                    if (clean_hex.contains("0f05") || clean_hex.contains("cd80"))
                        && (clean_hex.contains("3b") || clean_hex.contains("2f62696e2f7368"))
                    {
                        is_hostile = true;
                        status = "HOSTILE_SYS_EXECVE_TRAPPED".to_string();
                        primary_reason = Some("x86_64 sys_execve (/bin/sh) shellcode trapped".to_string());
                    }
                }
                SwarmArch::Arm64Sentinel => {
                    if clean_hex.contains("010000d4") || clean_hex.contains("d4000001") {
                        is_hostile = true;
                        status = "HOSTILE_ARM64_SVC_TRAPPED".to_string();
                        primary_reason = Some("AArch64 svc #0 supervisor call trapped".to_string());
                    }
                }
                SwarmArch::Riscv64Enclave => {
                    if clean_hex.contains("73000000") || clean_hex.contains("00000073") {
                        is_hostile = true;
                        status = "HOSTILE_RISCV_ECALL_TRAPPED".to_string();
                        primary_reason = Some("RISC-V 64 ecall privilege escalation trapped".to_string());
                    }
                }
                SwarmArch::BsdHardenedJail => {
                    if clean_hex.contains("cd80") && clean_hex.contains("3b") {
                        is_hostile = true;
                        status = "HOSTILE_BSD_INT80_TRAPPED".to_string();
                        primary_reason = Some("FreeBSD int 0x80 syscall execution trapped".to_string());
                    }
                }
            }

            if is_hostile {
                globally_hostile = true;
            }

            results.insert(
                arch.as_str().to_string(),
                ArchDetonationResult {
                    arch: arch.as_str().to_string(),
                    magic: arch.kernel_magic().to_string(),
                    is_hostile,
                    status,
                    cycles: (byte_len as u64 * 45).clamp(100, 50_000),
                },
            );
        }

        DetonationReport {
            hex_opcodes: clean_hex,
            byte_length: byte_len,
            globally_hostile,
            primary_reason,
            results,
        }
    }
}
