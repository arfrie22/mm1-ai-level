import type { Course } from "./Course";

export class SmmCourseViewer {
    canvas: HTMLCanvasElement;
    scale: number;
    course?: Course;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scale = 128;
    }

    public loadCourse(course: Course) {
        this.course = course;
        this.drawCourse();
    }

    public setScale(scale: number) {
        this.scale = scale;
        this.drawCourse();
    }

    drawCourse() {
        const context = this.canvas.getContext('2d');
        if (!context) {
            return;
        }

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.course) {
            return;
        }
        
        this.canvas.height = 27 * this.scale;
        this.canvas.width = this.course.blockWidth() * this.scale;


        context.fillStyle = 'red';
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const object of this.course.objects) {
            object.draw(context, this.scale, this.canvas.height);
        }
    }
}