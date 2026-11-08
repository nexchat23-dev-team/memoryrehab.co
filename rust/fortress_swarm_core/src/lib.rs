//! ==============================================================================
//! FORTRESS LAYER 35: POLYMORPHIC OS SWARM & MEMORY-SAFE HYPERVISOR CRATE
//! ==============================================================================
//! 
//! Crate: `fortress_swarm_core`
//! Target: Bare-Metal Microkernel Hypervisor & Polymorphic Execution Matrix
//! Security Standard: Memory-safe Rust with Zero-Unsafe Invariant
//! 
//! Modules:
//! - `types`: Polymorphic architecture descriptors, register banks, trap verdicts
//! - `vcpu`: Micro-vCPU hardware emulator and execution cycle scheduler
//! - `vfs`: In-memory virtual filesystem with Honeytoken canary tripwires
//! - `pqc`: Post-Quantum Dilithium-5 lattice verification & AES-256-GCM sealing
//! - `detonation`: Parallel Cross-Architecture Bytecode Detonation Chamber
//! - `supervisor`: Swarm instance manager, client IP pinning, and TTL rotation
//! ==============================================================================

pub mod types;
pub mod vcpu;
pub mod vfs;
pub mod pqc;
pub mod detonation;
pub mod supervisor;

// Convenient re-exports
pub use types::{RegisterBank, SwarmArch, TrapVerdict};
pub use vcpu::VirtualCpu;
pub use vfs::{VfsFile, VirtualFileSystem};
pub use pqc::{PqcDilithiumEnclave, PqcSignatureRecord};
pub use detonation::{ArchDetonationResult, DetonationChamber, DetonationReport};
pub use supervisor::{DispatchResult, SwarmHandleInfo, SwarmSupervisor};

/// Version identifier matching FORTRESS Enterprise specifications
pub const FORTRESS_SWARM_CORE_VERSION: &str = "12.6.0-RUST-SWARM";

/// Returns list of all supported polymorphic architectures
pub fn supported_architectures() -> &'static [&'static str] {
    &[
        "x86_64-fortress",
        "arm64-sentinel",
        "riscv64-enclave",
        "bsd-hardened-jail",
    ]
}
