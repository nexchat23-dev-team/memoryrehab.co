//! ==============================================================================
//! FORTRESS LAYER 35: SWARM OS SUPERVISOR & PINNING MANAGER
//! ==============================================================================

use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use crate::types::{SwarmArch, TrapVerdict};
use crate::vcpu::VirtualCpu;
use crate::detonation::{DetonationChamber, DetonationReport};
use crate::pqc::PqcDilithiumEnclave;

pub const MAX_ACTIVE_HANDLES: usize = 64;
pub const DEFAULT_TTL_SECS: u64 = 900; // 15 mins

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SwarmHandleInfo {
    pub handle_id: String,
    pub arch: String,
    pub profile: String,
    pub magic: String,
    pub os_release: String,
    pub sealed_hex: String,
    pub pqc_algorithm: String,
    pub expires_in_sec: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DispatchResult {
    pub success: bool,
    pub handle_id: String,
    pub arch: String,
    pub command: String,
    pub output: String,
    pub is_canary_tripped: bool,
    pub cycles: u64,
}

pub struct SwarmSupervisor {
    handles: HashMap<String, VirtualCpu>,
    pinned_clients: HashMap<String, String>,
    handle_order: Vec<String>,
    pub total_spawned: u64,
    pub total_rotated: u64,
    pub total_commands: u64,
    pub total_canary_trips: u64,
}

impl SwarmSupervisor {
    pub fn new() -> Self {
        Self {
            handles: HashMap::new(),
            pinned_clients: HashMap::new(),
            handle_order: Vec::new(),
            total_spawned: 0,
            total_rotated: 0,
            total_commands: 0,
            total_canary_trips: 0,
        }
    }

    /// Spawns an isolated ephemeral OS handle
    pub fn spawn_handle(&mut self, arch_opt: Option<SwarmArch>, client_ip: &str) -> SwarmHandleInfo {
        let arch = arch_opt.unwrap_or(SwarmArch::X86_64Fortress);
        let now_sec = 1794122400u64; // Epoch timestamp
        let rand_suffix = format!("{:08x}", self.total_spawned + 1);
        let handle_id = format!("swarm_rust_{}", rand_suffix);
        let canary_token = format!("canary_k35_rs_{}", rand_suffix);

        // Enforce capacity bounds (LRU eviction)
        if self.handles.len() >= MAX_ACTIVE_HANDLES {
            if let Some(oldest_id) = self.handle_order.first().cloned() {
                self.handles.remove(&oldest_id);
                self.handle_order.retain(|id| id != &oldest_id);
                self.pinned_clients.retain(|_, id| id != &oldest_id);
                self.total_rotated += 1;
            }
        }

        let vcpu = VirtualCpu::new(arch, &canary_token);
        self.handles.insert(handle_id.clone(), vcpu);
        self.handle_order.push(handle_id.clone());
        self.pinned_clients.insert(client_ip.to_string(), handle_id.clone());
        self.total_spawned += 1;

        // Generate synthetic sealed hex handle (AES-256-GCM + Dilithium-5)
        let sealed_hex = format!(
            "0x{}0000000000000000{}00000000000000000000000000000000{}",
            "a1b2c3d4e5f6a1b2c3d4e5f6", // 12B IV
            "11223344556677889900aabbccddeeff", // 16B TAG
            "cafebabedeadbeef00112233445566778899aabbccddeeff0011223344556677" // 32B SEED
        );

        SwarmHandleInfo {
            handle_id,
            arch: arch.as_str().to_string(),
            profile: arch.as_str().to_string(),
            magic: arch.kernel_magic().to_string(),
            os_release: arch.os_release_string().to_string(),
            sealed_hex,
            pqc_algorithm: "Dilithium-5 (NIST Level 5)".to_string(),
            expires_in_sec: DEFAULT_TTL_SECS,
        }
    }

    /// Dispatches a command into client's pinned OS handle
    pub fn dispatch(&mut self, command: &str, client_ip: &str) -> DispatchResult {
        self.total_commands += 1;

        let handle_id = match self.pinned_clients.get(client_ip) {
            Some(id) if self.handles.contains_key(id) => id.clone(),
            _ => {
                let info = self.spawn_handle(None, client_ip);
                info.handle_id
            }
        };

        let vcpu = self.handles.get_mut(&handle_id).unwrap();
        let (output, verdict) = vcpu.dispatch_command(command);
        let is_canary_tripped = matches!(verdict, TrapVerdict::HoneytokenTripped { .. });

        if is_canary_tripped {
            self.total_canary_trips += 1;
        }

        DispatchResult {
            success: true,
            handle_id,
            arch: vcpu.arch.as_str().to_string(),
            command: command.to_string(),
            output,
            is_canary_tripped,
            cycles: vcpu.cycles_consumed,
        }
    }

    /// Detonates raw bytecode across all architectures
    pub fn detonate(&self, hex_opcodes: &str) -> DetonationReport {
        DetonationChamber::detonate_hex(hex_opcodes)
    }

    pub fn active_count(&self) -> usize {
        self.handles.len()
    }
}
