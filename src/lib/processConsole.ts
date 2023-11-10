export class processConsole {
    // private frames: string[];
    private loadingInterval: NodeJS.Timeout | null;

    constructor() {
        // this.frames = ['⠹', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.loadingInterval = null;
    }

    private setColor(color: string, message: string): string {
        return `\x1b[${color}m${message}\x1b[0m`;
    }

    start(message: string): void {
        let i = 0;
        const frames = ['⠹', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        process.stdout.write(this.setColor('34', message + ' ')); // 34 is the ANSI code for blue
        this.loadingInterval = setInterval(() => {
            process.stdout.write('\r' + this.setColor('34', frames[i] + ' ' + message + ' '));
            i = (i + 1) % frames.length;
        }, 100);
    }
    complete(successMessage: string): void {
        if (this.loadingInterval !== null) {
            clearInterval(this.loadingInterval);
        }
        process.stdout.write(`\r${this.setColor('32', '✔')} ${this.setColor('32', successMessage)}\n`);
    }

    error(errorMessage: string): void {
        if (this.loadingInterval !== null) {
            clearInterval(this.loadingInterval);
        }
        process.stdout.write(`\r${this.setColor('31', errorMessage)}\n`); // 31 is the ANSI code for red
    }
}
