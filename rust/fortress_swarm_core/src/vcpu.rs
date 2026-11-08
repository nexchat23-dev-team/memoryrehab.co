//! ==============================================================================
//! FORTRESS LAYER 35: MICRO-VCPU HARDWARE EMULATOR & DISPATCHER
//! ==============================================================================

use crate::types::{RegisterBank, SwarmArch, TrapVerdict};
use crate::vfs::VirtualFileSystem;

pub const GUEST_RAM_SIZE: usize = 16 * 1024 * 1024; // 16 MB Contiguous RAM
pub const DEFAULT_CYCLE_BUDGET: u64 = 500_000;

#[derive(Debug, Clone)]
pub struct VirtualCpu {
    pub arch: SwarmArch,
    pub regs: RegisterBank,
    pub ram: Vec<u8>,
    pub vfs: VirtualFileSystem,
    pub cycle_budget: u64,
    pub cycles_consumed: u64,
    pub canary_token: String,
}

impl VirtualCpu {
    pub fn new(arch: SwarmArch, canary_token: &str) -> Self {
        let mut regs = RegisterBank::default();

        match arch {
            SwarmArch::X86_64Fortress => {
                regs.pc = 0x0000000000401000;
                regs.sp = 0x00007ffcb49a2000;
                regs.flags = 0x0000000000000202;
            }
            SwarmArch::Arm64Sentinel => {
                regs.pc = 0x0000005555550000;
                regs.sp = 0x0000007ffffff000;
                regs.flags = 0x0000000060000000;
                regs.gpr[8] = 221; // __NR_execve
            }
            SwarmArch::Riscv64Enclave => {
                regs.pc = 0x0000000000010000;
                regs.sp = 0x0000003ffffff000;
                regs.gpr[17] = 221; // a7 = __NR_execve
            }
            SwarmArch::BsdHardenedJail => {
                regs.pc = 0x08048000;
                regs.sp = 0x7fffffe0;
            }
        }

        Self {
            arch,
            regs,
            ram: vec![0u8; GUEST_RAM_SIZE], // Initialized 64KB hot page cache
            vfs: VirtualFileSystem::new(canary_token),
            cycle_budget: DEFAULT_CYCLE_BUDGET,
            cycles_consumed: 0,
            canary_token: canary_token.to_string(),
        }
    }

    /// Dispatches POSIX shell command into synthetic environment
    pub fn dispatch_command(&mut self, command: &str) -> (String, TrapVerdict) {
        let cmd_clean = command.trim().to_lowercase();
        let cycles = 250;
        self.cycles_consumed += cycles;

        if cmd_clean == "uname -a" || cmd_clean == "uname" {
            self.cycles_consumed += 150;
            let out = format!("{}\n", self.arch.os_release_string());
            (out, TrapVerdict::SafeExecution { cycles_used: self.cycles_consumed })
        } else if cmd_clean == "id" {
            let out = "uid=0(root) gid=0(root) groups=0(root) context=system_u:system_r:swarm_os_t:s0\n".to_string();
            (out, TrapVerdict::SafeExecution { cycles_used: self.cycles_consumed })
        } else if cmd_clean == "whoami" {
            (
                "root\n".to_string(),
                TrapVerdict::SafeExecution { cycles_used: self.cycles_consumed },
            )
        } else if cmd_clean.starts_with("ls") {
            (
                self.vfs.list_root(),
                TrapVerdict::SafeExecution { cycles_used: self.cycles_consumed },
            )
        } else if cmd_clean.contains("shadow") {
            self.cycles_consumed += 1300;
            let (content, _) = self.vfs.read("/etc/shadow");
            let out = content.unwrap_or_default();
            (
                out,
                TrapVerdict::HoneytokenTripped {
                    path: "/etc/shadow".to_string(),
                    canary_token: self.canary_token.clone(),
                },
            )
        } else if cmd_clean.contains("passwd") {
            self.cycles_consumed += 1200;
            let (content, _) = self.vfs.read("/etc/passwd");
            let out = content.unwrap_or_default();
            (
                out,
                TrapVerdict::HoneytokenTripped {
                    path: "/etc/passwd".to_string(),
                    canary_token: self.canary_token.clone(),
                },
            )
        } else if cmd_clean.contains("id_rsa") || cmd_clean.contains(".ssh") {
            self.cycles_consumed += 1500;
            let (content, _) = self.vfs.read("/root/.ssh/id_rsa");
            let out = content.unwrap_or_default();
            (
                out,
                TrapVerdict::HoneytokenTripped {
                    path: "/root/.ssh/id_rsa".to_string(),
                    canary_token: self.canary_token.clone(),
                },
            )
        } else if cmd_clean.contains("admin.conf") || cmd_clean.contains("kube") || cmd_clean.contains("k8s") {
            self.cycles_consumed += 1400;
            let (content, _) = self.vfs.read("/etc/kubernetes/admin.conf");
            let out = content.unwrap_or_default();
            (
                out,
                TrapVerdict::HoneytokenTripped {
                    path: "/etc/kubernetes/admin.conf".to_string(),
                    canary_token: self.canary_token.clone(),
                },
            )
        } else {
            (
                format!("sh: command not found: {}\n", command),
                TrapVerdict::SafeExecution { cycles_used: self.cycles_consumed },
            )
        }
    }
}
