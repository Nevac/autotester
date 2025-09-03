export default class StatisticColors {
    public static readonly RED = 'rgb(255, 99, 71)';
    public static readonly GREEN = 'rgb(60, 179, 113)';
    public static readonly BLUE = 'rgb(30, 144, 255)';
    public static readonly YELLOW = 'rgb(255, 165, 0)';
    public static readonly PINK = 'rgb(238, 130, 238)';
    public static readonly PURPLE = 'rgb(106, 90, 205)';

    public static getColorSet(): Set<string> {
        return new Set<string>([
            this.RED,
            this.GREEN,
            this.BLUE,
            this.YELLOW,
            this.PINK,
            this.PURPLE,
        ])
    }

    public static pickAndRemoveRandomColor(colors: Set<string>): string {
        const colorsArray =Array.from(colors.values());
        const color = colorsArray[0]
        colors.delete(color);
        return color;
    }
}