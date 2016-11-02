import { Component, ElementRef, Input, OnInit, ChangeDetectionStrategy, OnChanges } from '@angular/core';

export namespace Utils {  

    @Component({
        selector: 'letter-avatar',
        template: `
            <div *ngIf="props" [style.background-color]="props.background" [style.width] = "props.size" [style.line-height]='props.lineheight' [style.height] = 'props.size' [style.font-size] = 'props.fontSize' [style.border] = 'props.border' [style.border-radius] = 'props.borderradius' [style.text-align] ="props.textalign"> 
            <div [style.color]='fontColor'>{{props.letter}}</div>
            </div>
            `,
        changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class LetterAvatar implements OnInit, OnChanges {
        @Input('background') background: string = null;
        @Input('fontSize') fontSize: number = 49;
        @Input('padding') padding: number = 28;
        @Input('letter') letter: string = null;
        @Input('size') size: number = 100;
        @Input('isSquare') isSquare: boolean = false;
        @Input('fontColor') fontColor: string = '#FFFFFF';
        @Input('border') border: string;
        @Input('text') text: string;
        @Input('fixedColor') fixedColor: string;
        props: Object = null;
        private _el: HTMLElement;

        constructor(el: ElementRef) {
            this._el = el.nativeElement;
        }
        test() {
            this.generateLetter();
        }

        generateLetter() {
            if (!this) {
                throw Error("LetterAvatarDirective configdata not provides");
            }
            if (!this.text) {
                this.text = '?';
            }            
            var size = this && this.size ? this.size : 100;
            this.fontColor = this.fontColor ? this.fontColor : "#FFFFFF";
            var isSquare = this && this.isSquare ? true : false;
            var border = this && this.border ? this.border : "1px solid #d3d3d3";
            var background = this && this.background ? this.background : null;
            if (this.letter == null) {
                if (!this.text) {
                    this.letter = '?';
                } else {
                    var text = this && this.text ? this.text : null;
                    var textArray = text.split(' ');
                    var letter = textArray[0].substr(0, 1) + '' + (textArray.length > 1 ? textArray[1].substr(0, 1) : '');
                    letter = letter.toUpperCase();
                    this.letter = letter;
                }
            }
            this.background = background;
            this.fontSize = (39 * size) / 100;
            this.padding = (28 * size) / 100;
            
            this.size = size;
            this.props = new Object();
            this.props['size'] = size + 'px';
            this.props['lineheight'] = this.size + 'px';
            this.props['letter'] = this.letter;
            this.props['fontSize'] = this.fontSize + 'px';
            if (isSquare) {
                this.props['borderradius'] = '0%';
            } else {
                this.props['borderradius'] = '50%';
            }
            this.props['textalign'] = 'center';
            this.props['border'] = border;
            this.props['background'] = background;
            if (this.fixedColor && !background) {
                this.props['background'] = background || this.colorize(this.letter);
            } else {
                this.props['background'] = background || this.getRandomColor();
            }
            return true;
        };

        getRandomColor() {
            var colours: any = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
            var colourIndex = (this.letter.charCodeAt(0) - 65) % 19;
            return colours[colourIndex];
            //var letters = '0123456789ABCDEF'.split('');
            //var color = '#';
            //for (var i = 0; i < 6; i++) {
            //    color += letters[Math.floor(Math.random() * 16)];
            //}
            //return color;
        }
        colorize(str) {
            for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
            var color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
            return '#' + Array(6 - color.length + 1).join('0') + color;
        }

        ngOnInit() {
            this.generateLetter();
        }
        ngOnChanges(...args: any[]) {
            this.generateLetter();
        }
    }
}