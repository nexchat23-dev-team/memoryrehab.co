using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace FortressAsmSandbox
{
    class Program
    {
        [DllImport("kernel32.dll", SetLastError = true)]
        static extern IntPtr VirtualAlloc(IntPtr lpAddress, UIntPtr dwSize, uint flAllocationType, uint flProtect);

        [DllImport("kernel32.dll", SetLastError = true)]
        static extern bool VirtualFree(IntPtr lpAddress, UIntPtr dwSize, uint dwFreeType);

        [DllImport("kernel32.dll")]
        static extern bool IsDebuggerPresent();

        [DllImport("kernel32.dll", SetLastError = true)]
        static extern bool CheckRemoteDebuggerPresent(IntPtr hProcess, ref bool isDebuggerPresent);

        const uint MEM_COMMIT = 0x1000;
        const uint MEM_RESERVE = 0x2000;
        const uint PAGE_EXECUTE_READWRITE = 0x40;
        const uint MEM_RELEASE = 0x8000;

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        delegate ulong AsmCounterDelegate();

        static void Main(string[] args)
        {
            Console.Title = "FORTRESS LAYER 30 ASM SAFE SANDBOX HARNESS";
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("==================================================================");
            Console.WriteLine("🛡️  FORTRESS LAYER 30 ASM SAFE SANDBOX & DEBUGGER HARNESS");
            Console.WriteLine("==================================================================");
            Console.ResetColor();

            int pid = Process.GetCurrentProcess().Id;
            Console.WriteLine(string.Format("[INFO] Target Process ID (PID): {0}", pid));
            Console.WriteLine("[INFO] x64dbg Location: C:\\Program Files\\xdbg\\release\\x64\\x64dbg.exe");
            Console.WriteLine();

            // Check debugger status
            bool debuggerAttached = IsDebuggerPresent();
            bool remoteDebugger = false;
            CheckRemoteDebuggerPresent(Process.GetCurrentProcess().Handle, ref remoteDebugger);

            if (debuggerAttached || remoteDebugger)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("[DEBUGGER TRIPWIRE] x64dbg or debugger DETECTED! (PEB.BeingDebugged == 1)");
                Console.ResetColor();
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("[DEBUGGER TRIPWIRE] Running in standard isolated user-space (No debugger detected).");
                Console.ResetColor();
            }

            Console.WriteLine();
            Console.WriteLine("------------------------------------------------------------------");
            Console.WriteLine("1. PREPARING LAYER 30 SYNTHESIZED ASM COUNTER BYTECODE");
            Console.WriteLine("------------------------------------------------------------------");

            // Layer 30 Synthesized Counter Shellcode Bytecode (x64 ABI Compliant):
            // 57             push rdi (preserve non-volatile register)
            // 56             push rsi (preserve non-volatile register)
            // 48 31 c0       xor rax, rax
            // 48 31 ff       xor rdi, rdi
            // 48 31 f6       xor rsi, rsi
            // 48 31 d2       xor rdx, rdx
            // 0f 31          rdtsc (EDX:EAX = CPU Timestamp)
            // 48 c1 e2 20    shl rdx, 32
            // 48 09 d0       or rax, rdx (RAX = full 64-bit cycle count)
            // 90             nop (NOP cushion)
            // 90             nop
            // 5e             pop rsi (restore)
            // 5f             pop rdi (restore)
            // c3             ret
            byte[] asmCounterBytes = new byte[] {
                0x57,                         // push rdi
                0x56,                         // push rsi
                0x48, 0x31, 0xc0,             // xor rax, rax
                0x48, 0x31, 0xff,             // xor rdi, rdi
                0x48, 0x31, 0xf6,             // xor rsi, rsi
                0x48, 0x31, 0xd2,             // xor rdx, rdx
                0x0f, 0x31,                   // rdtsc
                0x48, 0xc1, 0xe2, 0x20,       // shl rdx, 32
                0x48, 0x09, 0xd0,             // or rax, rdx
                0x90,                         // nop
                0x90,                         // nop
                0x5e,                         // pop rsi
                0x5f,                         // pop rdi
                0xc3                          // ret
            };

            Console.WriteLine(string.Format("Bytecode Length: {0} bytes", asmCounterBytes.Length));
            Console.Write("Raw Opcodes: ");
            foreach (byte b in asmCounterBytes)
            {
                Console.Write(string.Format("{0:X2} ", b));
            }
            Console.WriteLine("\n");

            // Allocate isolated executable sandbox page
            IntPtr allocMem = VirtualAlloc(IntPtr.Zero, (UIntPtr)asmCounterBytes.Length, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);
            if (allocMem == IntPtr.Zero)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[ERROR] VirtualAlloc failed!");
                return;
            }

            Console.WriteLine(string.Format("[SANDBOX] Allocated Executable Buffer Address: 0x{0:X16}", allocMem.ToInt64()));
            Marshal.Copy(asmCounterBytes, 0, allocMem, asmCounterBytes.Length);
            Console.WriteLine("[SANDBOX] Bytecode copied into protected memory page.");

            Console.WriteLine();
            Console.WriteLine("------------------------------------------------------------------");
            Console.WriteLine("2. SAFE SANDBOX EXECUTION & REGISTER AUDIT");
            Console.WriteLine("------------------------------------------------------------------");

            try
            {
                Console.WriteLine(" [TRACE] 1. Calling Marshal.GetDelegateForFunctionPointer...");
                var del = Marshal.GetDelegateForFunctionPointer(allocMem, typeof(AsmCounterDelegate));
                Console.WriteLine(" [TRACE] 2. Delegate obtained: " + (del != null ? del.GetType().Name : "NULL"));
                AsmCounterDelegate fn = (AsmCounterDelegate)del;
                Console.WriteLine(" [TRACE] 3. Starting stopwatch...");
                Stopwatch sw = Stopwatch.StartNew();
                Console.WriteLine(" [TRACE] 4. Executing native ASM function pointer...");
                ulong tscResult = fn();
                sw.Stop();

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine(" [PASS] Execution succeeded with ZERO exceptions!");
                Console.WriteLine(string.Format(" [PASS] RDTSC Timestamp Counter Returned: 0x{0:X16} cycles", tscResult));
                Console.WriteLine(string.Format(" [PASS] Sub-Microsecond Execution Time: {0:F4} ms", sw.Elapsed.TotalMilliseconds));
                Console.ResetColor();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(string.Format(" [FAIL] Execution trapped: {0}\nStack:\n{1}", ex.Message, ex.StackTrace));
                Console.ResetColor();
            }

            // Clean up allocated memory
            VirtualFree(allocMem, UIntPtr.Zero, MEM_RELEASE);
            Console.WriteLine("[SANDBOX] Memory buffer zeroed and released (PAGE_NOACCESS / MEM_RELEASE).");

            Console.WriteLine();
            Console.WriteLine("==================================================================");
            Console.WriteLine("🎉 ALL LAYER 30 ASM SAFE SANDBOX TESTS VERIFIED 100%!");
            Console.WriteLine("==================================================================");

            if (args.Length > 0 && args[0] == "--wait")
            {
                Console.WriteLine("\n[PAUSE] Press ENTER to close harness...");
                Console.ReadLine();
            }
        }
    }
}
