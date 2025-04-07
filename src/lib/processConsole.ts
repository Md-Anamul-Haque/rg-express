
// export class ProcessConsole {
//     private loadingInterval: NodeJS.Timeout | null;

//     constructor() {
//         this.loadingInterval = null;
//     }

//     private setColor(color: string, message: string): string {
//         return `\x1b[${color}m${message}\x1b[0m`;
//     }

//     start(message: string, frames: string[] = ['⠹', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'], speed: number = 100): void {
//         let i = 0;
//         process.stdout.write(this.setColor('34', message + ' '));
//         this.loadingInterval = setInterval(() => {
//             process.stdout.write('\r' + this.setColor('34', frames[i] + ' ' + message + ' '));
//             i = (i + 1) % frames.length;
//         }, speed);
//     }

//     stop(): void {
//         if (this.loadingInterval !== null) {
//             clearInterval(this.loadingInterval);
//         }
//     }

//     complete(successMessage: string): void {
//         this.stop();
//         process.stdout.write(`\r${this.setColor('1;92', '✔')} ${this.setColor('38;5;2', successMessage)}\n`);
//     }

//     error(errorMessage: string): void {
//         this.stop();
//         process.stdout.write(`\r${this.setColor('31',errorMessage)} \n`);
//     }

//     false(errorMessage: string): void {
//         this.stop();
//         process.stdout.write(`\r${this.setColor('31','✗')} ${this.setColor('30', errorMessage)} \n`);
//     }
// }

// // // Example usage
// // const console = new ProcessConsole();
// // console.start('Processing');
// // // Perform some task...
// // console.complete('Task completed successfully.');


export class ProcessConsole {
    private loadingInterval: NodeJS.Timeout | null = null;
    private readonly DEFAULT_FRAMES = ['⠹', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    private readonly DEFAULT_SPEED = 100;

    // ANSI color codes as constants for better maintainability
    private readonly COLORS = {
        blue: '34',
        red: '31',
        green: '38;5;2',
        brightGreen: '1;92',
        black: '30'
    };

    private readonly SYMBOLS = {
        success: '✔',
        failure: '✗'
    };

    constructor() { }

    private formatMessage(color: string, message: string, symbol?: string): string {
        const prefix = symbol ? `${this.setColor(color, symbol)} ` : '';
        return `\r${prefix}${this.setColor(color, message)}\x1b[0m`;
    }

    private setColor(color: string, text: string): string {
        return `\x1b[${color}m${text}`;
    }

    public start(
        message: string,
        frames: string[] = this.DEFAULT_FRAMES,
        speed: number = this.DEFAULT_SPEED
    ): void {
        if (this.loadingInterval) {
            this.stop();
        }

        let frameIndex = 0;
        process.stdout.write(this.setColor(this.COLORS.blue, `${message} `));

        this.loadingInterval = setInterval(() => {
            process.stdout.write(
                this.formatMessage(
                    this.COLORS.blue,
                    `${frames[frameIndex]} ${message}`
                )
            );
            frameIndex = (frameIndex + 1) % frames.length;
        }, speed);
    }

    public stop(): void {
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
            this.loadingInterval = null;
            process.stdout.write('\r'); // Clear the line
        }
    }

    public complete(successMessage: string): void {
        this.stop();
        process.stdout.write(
            this.formatMessage(
                this.COLORS.green,
                successMessage,
                this.setColor(this.COLORS.brightGreen, this.SYMBOLS.success)
            ) + '\n'
        );
    }

    public error(errorMessage: string): void {
        this.stop();
        process.stdout.write(
            this.formatMessage(this.COLORS.red, errorMessage) + '\n'
        );
    }

    public fail(errorMessage: string): void {
        this.stop();
        process.stdout.write(
            this.formatMessage(
                this.COLORS.black,
                errorMessage,
                this.setColor(this.COLORS.red, this.SYMBOLS.failure)
            ) + '\n'
        );
    }
}

// // Example usage with async operation
// async function example() {
//     const console = new ProcessConsole();
//     console.start('Processing task');

//     try {
//         await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work
//         console.complete('Task completed successfully');
//     } catch (error) {
//         console.fail('Task failed unexpectedly');
//     }
// }
