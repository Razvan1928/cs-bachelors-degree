import { Component, OnInit } from '@angular/core';
import { WaferMap, waferMapTag } from '@ni/nimble-components/dist/esm/wafer-map';
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

  changeHighlightedTagBellowYield(tag: number) {
    if (tag === null || tag === undefined || tag === 0) {
      this.lastGeneratedWafer.highlightedTags = [];
    }
    else {
      if(this.lastGeneratedWafer.highlightedTags){
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
    }
    else {
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
          const randomNumber = this.getRandomWholeNumber(1, 100);
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
