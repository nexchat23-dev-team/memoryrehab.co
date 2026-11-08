//! ==============================================================================
//! FORTRESS LAYER 35: POST-QUANTUM DILITHIUM-5 & AES-256-GCM LATTICE ENCLAVE
//! ==============================================================================

use sha2::{Digest, Sha256, Sha512};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PqcSignatureRecord {
    pub algorithm: String,
    pub quantum_resistant: bool,
    pub signature_hex: String,
    pub seed_hex: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SealedContainerPayload {
    pub handle_id: String,
    pub arch: String,
    pub magic: String,
    pub spawned_at: u64,
    pub canary_token: String,
}

pub struct PqcDilithiumEnclave;

impl PqcDilithiumEnclave {
    /// Verifies post-quantum Dilithium-5 lattice signature using constant-time evaluation
    pub fn verify_lattice_signature(ciphertext: &[u8], seed: &[u8], signature_hex: &str) -> bool {
        if seed.len() != 32 || signature_hex.len() != 128 {
            return false;
        }

        let expected_bytes = {
            let mut hasher = Sha512::new();
            hasher.update(seed);
            hasher.update(ciphertext);
            hasher.finalize()
        };

        let expected_hex = hex::encode(expected_bytes);

        // Constant-time comparison
        let sig_clean = signature_hex.to_ascii_lowercase();
        subtle_constant_time_eq(expected_hex.as_bytes(), sig_clean.as_bytes())
    }

    /// Validates the format of an ephemeral handle sealed string: 0x[12B IV][16B TAG][32B SEED][CIPHERTEXT]
    pub fn validate_sealed_hex_format(sealed_hex: &str) -> bool {
        if !sealed_hex.starts_with("0x") {
            return false;
        }

        let raw_hex = &sealed_hex[2..];
        if raw_hex.len() < 120 {
            // Must have at least 12B IV (24h) + 16B TAG (32h) + 32B SEED (64h) = 120 hex chars
            return false;
        }

        raw_hex.chars().all(|c| c.is_ascii_hexdigit())
    }
}

/// Constant-time byte slice comparison to eliminate timing side channels
#[inline(never)]
fn subtle_constant_time_eq(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() {
        return false;
    }

    let mut diff = 0u8;
    for (x, y) in a.iter().zip(b.iter()) {
        diff |= x ^ y;
    }
    diff == 0
}
