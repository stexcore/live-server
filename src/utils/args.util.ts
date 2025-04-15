export default {

    /**
     * Parse a list of arguments
     * @param args Arguments
     * @returns arguments and flags
     */
    parseArgs(args: string[]) {
        const flags: Record<string, string | boolean> = {};
        const defaults: string[] = [];
    
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
    
            if (arg.startsWith("--")) {
                // Handle flags with '=' (e.g., --port=8080)
                const [key, value] = arg.split("=");
                if (value !== undefined) {
                    flags[key.replace("--", "")] = value;
                } else {
                    // Check if the next argument is the value
                    const nextArg = args[i + 1];
                    if (nextArg && !nextArg.startsWith("-")) {
                        flags[key.replace("--", "")] = nextArg;
                        i++; // Skip the next argument as it's the value
                    } else {
                        flags[key.replace("--", "")] = true; // Flag without a value
                    }
                }
            } else if (arg.startsWith("-")) {
                // Handle short flags (e.g., -p 8080)
                const key = arg.replace("-", "");
                const nextArg = args[i + 1];
                if (nextArg && !nextArg.startsWith("-")) {
                    flags[key] = nextArg;
                    i++; // Skip the next argument as it's the value
                } else {
                    flags[key] = true; // Flag without a value
                }
            } else {
                // Collect default (non-flag) arguments
                defaults.push(arg);
            }
        }
    
        return { flags, defaults };
    }
    
}