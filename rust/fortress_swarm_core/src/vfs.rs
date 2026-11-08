//! ==============================================================================
//! FORTRESS LAYER 35: IN-MEMORY VIRTUAL FILE SYSTEM & HONEYTOKEN CANARIES
//! ==============================================================================

use std::collections::HashMap;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VfsFile {
    pub path: String,
    pub content: String,
    pub is_canary: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VirtualFileSystem {
    files: HashMap<String, VfsFile>,
    pub canary_token: String,
}

impl VirtualFileSystem {
    pub fn new(canary_token: &str) -> Self {
        let mut files = HashMap::new();

        // 1. /etc/passwd Honeytoken
        files.insert(
            "/etc/passwd".to_string(),
            VfsFile {
                path: "/etc/passwd".to_string(),
                content: format!(
                    "root:x:0:0:root:/root:/bin/sh\ncanary_operative:x:1001:1001:CanaryTrap:{}:/honeypot:/bin/sh\n",
                    canary_token
                ),
                is_canary: true,
            },
        );

        // 2. /etc/shadow Honeytoken
        files.insert(
            "/etc/shadow".to_string(),
            VfsFile {
                path: "/etc/shadow".to_string(),
                content: format!(
                    "root:$6$rounds=50000$fortress$hash:19000:0:99999:7:::\ncanary_hacker:{}:19000:0:99999:7:::\n",
                    canary_token
                ),
                is_canary: true,
            },
        );

        // 3. /root/.ssh/id_rsa Private Key Decoy
        files.insert(
            "/root/.ssh/id_rsa".to_string(),
            VfsFile {
                path: "/root/.ssh/id_rsa".to_string(),
                content: format!(
                    "-----BEGIN OPENSSH PRIVATE KEY-----\nCANARY_RUST_DECOY_KEY_{}\n-----END OPENSSH PRIVATE KEY-----\n",
                    canary_token
                ),
                is_canary: true,
            },
        );

        // 4. /etc/kubernetes/admin.conf Cluster Admin Decoy
        files.insert(
            "/etc/kubernetes/admin.conf".to_string(),
            VfsFile {
                path: "/etc/kubernetes/admin.conf".to_string(),
                content: format!(
                    "apiVersion: v1\nkind: Config\ncurrent-context: fortress-cluster\nusers:\n- name: admin\n  user:\n    token: {}\n",
                    canary_token
                ),
                is_canary: true,
            },
        );

        // 5. Benign procfs files
        files.insert(
            "/proc/version".to_string(),
            VfsFile {
                path: "/proc/version".to_string(),
                content: "Linux 6.8.0-fortress-hardened #1 SMP PREEMPT_DYNAMIC Sun Nov 1 2026 x86_64 GNU/Linux\n".to_string(),
                is_canary: false,
            },
        );

        Self {
            files,
            canary_token: canary_token.to_string(),
        }
    }

    /// Reads a file from the VFS. Returns (Option<Content>, is_canary_tripped)
    pub fn read(&self, path: &str) -> (Option<String>, bool) {
        if let Some(file) = self.files.get(path) {
            (Some(file.content.clone()), file.is_canary)
        } else {
            (None, false)
        }
    }

    pub fn list_root(&self) -> String {
        "total 36\ndrwxr-xr-x  14 root root 4096 Nov  1 2026 .\ndrwxr-xr-x  14 root root 4096 Nov  1 2026 ..\ndrwxr-xr-x   2 root root 4096 Nov  1 2026 bin\ndrwxr-xr-x   2 root root 4096 Nov  1 2026 etc\ndr-xr-xr-x  11 root root    0 Nov  1 2026 proc\ndrwx------   2 root root 4096 Nov  1 2026 root\ndrwxr-xr-x   5 root root 4096 Nov  1 2026 usr\n".to_string()
    }
}
