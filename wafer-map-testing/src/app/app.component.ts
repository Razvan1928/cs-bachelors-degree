import { Component, OnInit } from '@angular/core';
import { waferMapTag } from '@ni/nimble-components/dist/esm/wafer-map';
import type { WaferMapDie } from '@ni/nimble-components/dist/esm/wafer-map/types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'wafer-map-testing';
  dieCount: number = 1000;
  loginData = { username: '', password: '' };
  errorMessage: string = '';
  apiUrl = environment.apiUrl;
  pythonApi = environment.pythonApi;
  tag = '';
  tagAsNumber: number = 0;
  lastGeneratedWafer = document.createElement(waferMapTag);
  loginButtonClicked = false;
  loginSuccessful = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
      loginButton.addEventListener('click', () => {
        this.loginButtonClicked = true;
      });
    }

    const waferMapContainer = document.getElementById('wafer-map-container');
    if (waferMapContainer) {
      waferMapContainer.append(this.lastGeneratedWafer);
    }
  }

  onSubmit() {
    this.http.post(`${this.apiUrl}/Auth/login`, this.loginData).subscribe(
      () => {
        alert('Login successful!');
        this.loginSuccessful = true;
        this.errorMessage = '';
      },
      error => {
        this.errorMessage = 'Invalid username or password';
        this.loginSuccessful = false;
      }
    );
  }

  detectHoughLines() {
    const waferMapData = this.lastGeneratedWafer.dies;
    this.http.post(`${this.pythonApi}/hough_lines`, waferMapData).subscribe(
      (lines: any) => {
        this.drawLines(lines);
      }
    );
  }

  detectHoughCircles() {
    const waferMapData = this.lastGeneratedWafer.dies;
    this.http.post(`${this.pythonApi}/hough_circles`, waferMapData).subscribe(
      (circles: any) => {
        this.drawCircles(circles);
      }
    );
  }

  drawLines(lines: any) {
    const canvas = document.getElementById('waferMapCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous lines

    lines.forEach((line: any) => {
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  drawCircles(circles: any) {
    const canvas = document.getElementById('waferMapCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = 400 / Math.sqrt(this.lastGeneratedWafer.dies.length);
    const axesScale = 450 / Math.sqrt(this.lastGeneratedWafer.dies.length);
    circles.forEach((circle: any) => {
      ctx.beginPath();
      const scaledCircleX = circle.x * axesScale;
      const scaledCircleY = circle.y * axesScale;
      const scaledCircleR = circle.r * scale;
      ctx.arc(scaledCircleX , scaledCircleY, scaledCircleR, 0, Math.PI * 2);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 4;
      ctx.stroke();
    });
  }

  changeHighlightedTagBellowYield(tag: number) {
    if (tag === null || tag === undefined || tag === 0) {
      this.lastGeneratedWafer.highlightedTags = [];
    } else {
      if (this.lastGeneratedWafer.highlightedTags) {
        this.lastGeneratedWafer.highlightedTags = [];
      }
      for (var i = 0; i <= tag; i++) {
        this.lastGeneratedWafer.highlightedTags.push(i.toString());
      }
    }
  }

  changeHighlightedTag(tag: string) {
    if (tag === "") {
      this.lastGeneratedWafer.highlightedTags = [];
    } else {
      this.lastGeneratedWafer.highlightedTags = [tag];
    }
  }

  generateWaferMap(dieCount: number) {
    const waferMapDies = this.generateDies(dieCount);
    this.lastGeneratedWafer.dies = waferMapDies;
    this.lastGeneratedWafer.colorScale = {
      colors: ['red', 'orange', 'yellow', 'green'],
      values: ['1', '33', '66', '100']
    };
  }

  generateDies(diesCount: number): WaferMapDie[] {
    const wafermapDieSet: WaferMapDie[] = [];
    const sideLength = Math.sqrt(diesCount / Math.PI) * 2;
    const radius = sideLength / 2;
    const centerX = radius;
    const centerY = centerX;

    for (let i = 0; i <= sideLength; i++) {
      for (let j = 0; j <= sideLength; j++) {
        const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
        if (distance <= radius) {
          const tags = this.getRandomTags();
          var randomNumber = this.getRandomWholeNumber(1, 100);
          tags.push(randomNumber.toString());
          wafermapDieSet.push({ x: i, y: j, value: `${randomNumber}`, tags: tags });
        }
      }
    }
    return wafermapDieSet;
  }

  generateScratchedWaferMap(dieCount: number) {
    const waferMapDies = this.generateScratchedDies(dieCount);
    this.lastGeneratedWafer.dies = waferMapDies;
    this.lastGeneratedWafer.colorScale = {
      colors: ['red', 'orange', 'yellow', 'green'],
      values: ['1', '33', '66', '100']
    };
  }

  generateScratchedDies(diesCount: number): WaferMapDie[] {
    const wafermapDieSet: WaferMapDie[] = [];
    const sideLength = Math.sqrt(diesCount / Math.PI) * 2;
    const radius = sideLength / 2;
    const centerX = radius;
    const centerY = centerX;

    const slope = 0.5;
    const intercept = centerY - slope * centerX;
    const scratchLine = (x: number, y: number) =>  Math.abs(y - (slope * x + intercept)) < 1;

    for (let i = 0; i <= sideLength; i++) {
      for (let j = 0; j <= sideLength; j++) {
        const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
        if (distance <= radius) {
          const tags = this.getRandomTags();
          var randomNumber = this.getRandomWholeNumber(1, 100);
          if (scratchLine(i, j)) {
            randomNumber = 0;
          }
          tags.push(randomNumber.toString());
          wafermapDieSet.push({ x: i, y: j, value: `${randomNumber}`, tags: tags });
        }
      }
    }
    return wafermapDieSet;
  }

  generateDonutWaferMap(dieCount: number) {
    const waferMapDies = this.generateDonutDies(dieCount);
    this.lastGeneratedWafer.dies = waferMapDies;
    this.lastGeneratedWafer.colorScale = {
      colors: ['red', 'orange', 'yellow', 'green'],
      values: ['1', '33', '66', '100']
    };
  }

  generateDonutDies(diesCount: number): WaferMapDie[] {
    const wafermapDieSet: WaferMapDie[] = [];
    const sideLength = Math.sqrt(diesCount / Math.PI) * 2;
    const radius = sideLength / 2;
    const centerX = radius;
    const centerY = centerX;

    for (let i = 0; i <= sideLength; i++) {
      for (let j = 0; j <= sideLength; j++) {
        const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
        if (distance <= radius / 2 && distance >= radius / 4) {
          const tags = this.getRandomTags();
          var randomNumber = 0;
          tags.push(randomNumber.toString());
          wafermapDieSet.push({ x: i, y: j, value: `${randomNumber}`, tags: tags });
        }
        else if (distance <= radius) {
          const tags = this.getRandomTags();
          var randomNumber = this.getRandomWholeNumber(1, 100);
          tags.push(randomNumber.toString());
          wafermapDieSet.push({ x: i, y: j, value: `${randomNumber}`, tags: tags });
        }
      }
    }
    return wafermapDieSet;
  }

  getRandomTags(): any {
    const hardBin = 'HardBin' + this.getRandomWholeNumber(1, 5);
    const softBin = 'SoftBin' + this.getRandomWholeNumber(1, 5);
    const binType = 'BinType' + this.getRandomWholeNumber(0, 1) ? 'Good' : 'Bad';
    return [hardBin, softBin, binType];
  }

  getRandomWholeNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  deleteLoginButton() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
      loginButton.remove();
    }
  }
}
