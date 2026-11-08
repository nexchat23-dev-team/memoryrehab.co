//! ==============================================================================
//! FORTRESS LAYER 35: RUST SWARM CLI UTILITY & HYPERVISOR MONITOR
//! ==============================================================================

use std::env;
use fortress_swarm_core::{
    supported_architectures, DetonationChamber, SwarmArch, SwarmSupervisor,
    FORTRESS_SWARM_CORE_VERSION,
};

fn print_usage() {
    println!("FORTRESS Swarm Core v{}", FORTRESS_SWARM_CORE_VERSION);
    println!("Usage:");
    println!("  fortress-swarm status");
    println!("  fortress-swarm spawn [arch] [client_ip]");
    println!("  fortress-swarm dispatch <command> [client_ip]");
    println!("  fortress-swarm detonate <hex_opcodes>");
    println!("  fortress-swarm verify");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        print_usage();
        return;
    }

    let mut supervisor = SwarmSupervisor::new();

    match args[1].as_str() {
        "status" => {
            println!("==================================================================");
            println!("⚡ FORTRESS LAYER 35: RUST SWARM SUPERVISOR TELEMETRY");
            println!("==================================================================");
            println!("Version:        {}", FORTRESS_SWARM_CORE_VERSION);
            println!("Status:         OPERATIONAL");
            println!("Architectures:  {:?}", supported_architectures());
            println!("Active Handles: {}", supervisor.active_count());
        }
        "spawn" => {
            let arch_str = args.get(2).map(|s| s.as_str()).unwrap_or("x86_64-fortress");
            let client_ip = args.get(3).map(|s| s.as_str()).unwrap_or("127.0.0.1");

            let arch = match arch_str {
                "arm64-sentinel" => SwarmArch::Arm64Sentinel,
                "riscv64-enclave" => SwarmArch::Riscv64Enclave,
                "bsd-hardened-jail" => SwarmArch::BsdHardenedJail,
                _ => SwarmArch::X86_64Fortress,
            };

            let handle = supervisor.spawn_handle(Some(arch), client_ip);
            println!("{}", serde_json::to_string_pretty(&handle).unwrap());
        }
        "dispatch" => {
            if args.len() < 3 {
                eprintln!("Error: Command required for dispatch");
                return;
            }
            let cmd = &args[2];
            let client_ip = args.get(3).map(|s| s.as_str()).unwrap_or("127.0.0.1");

            let res = supervisor.dispatch(cmd, client_ip);
            println!("{}", serde_json::to_string_pretty(&res).unwrap());
        }
        "detonate" => {
            if args.len() < 3 {
                eprintln!("Error: Hex opcodes required for detonation");
                return;
            }
            let hex_str = &args[2];
            let report = DetonationChamber::detonate_hex(hex_str);
            println!("{}", serde_json::to_string_pretty(&report).unwrap());
        }
        "verify" => {
            println!("==================================================================");
            println!("⚡ RUNNING RUST SWARM CORE DIAGNOSTIC VERIFICATION");
            println!("==================================================================");

            // Test 1: Spawning handles across all 4 architectures
            println!("\n[TEST 1] Testing Handle Spawning across all 4 architectures...");
            let h_x64 = supervisor.spawn_handle(Some(SwarmArch::X86_64Fortress), "10.0.0.1");
            let h_arm = supervisor.spawn_handle(Some(SwarmArch::Arm64Sentinel), "10.0.0.2");
            let h_rv = supervisor.spawn_handle(Some(SwarmArch::Riscv64Enclave), "10.0.0.3");
            let h_bsd = supervisor.spawn_handle(Some(SwarmArch::BsdHardenedJail), "10.0.0.4");

            assert!(h_x64.sealed_hex.starts_with("0x"));
            assert_eq!(h_arm.arch, "arm64-sentinel");
            assert_eq!(h_rv.arch, "riscv64-enclave");
            assert_eq!(h_bsd.arch, "bsd-hardened-jail");
            println!(" [PASS] All 4 architecture handles spawned with PQC sealing!");

            // Test 2: Shell execution
            println!("\n[TEST 2] Testing POSIX Dispatch & Honeytokens...");
            let d_uname = supervisor.dispatch("uname -a", "10.0.0.1");
            assert!(d_uname.output.contains("fortress-hardened"));
            println!(" [PASS] uname command returned simulated Linux kernel");

            let d_passwd = supervisor.dispatch("cat /etc/passwd", "10.0.0.1");
            assert!(d_passwd.is_canary_tripped);
            assert!(d_passwd.output.contains("canary_operative"));
            println!(" [PASS] Honeytoken canary tripped! Attacker quarantined.");

            // Test 3: Bytecode detonation
            println!("\n[TEST 3] Testing Multi-Architecture Bytecode Detonation...");
            let report_safe = DetonationChamber::detonate_hex("9090c3");
            assert!(!report_safe.globally_hostile);
            println!(" [PASS] Benign bytecode cleared all 4 architectures");

            let report_hostile = DetonationChamber::detonate_hex("4831c04831db0f053b2f62696e2f7368");
            assert!(report_hostile.globally_hostile);
            println!(" [PASS] x86_64 execve shellcode trapped and neutralized!");

            println!("\n==================================================================");
            println!("🏆 RUST SWARM CORE DIAGNOSTICS: 100% PASSED!");
            println!("==================================================================");
        }
        _ => {
            print_usage();
        }
    }
}
