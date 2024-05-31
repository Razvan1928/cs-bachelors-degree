import { Component } from '@angular/core';
import { waferMapTag } from '@ni/nimble-components/dist/esm/wafer-map';
import type { WaferMapDie } from '@ni/nimble-components/dist/esm/wafer-map/types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wafer-map-testing';
  dieCount: number = 100;
  loginData = { username: '', password: '' };
  errorMessage: string = '';
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post(`${this.apiUrl}/Auth/login`, this.loginData).subscribe(
      () => {
        alert('Login successful!');
      },
      error => {
        this.errorMessage = 'Invalid username or password';
      }
    );
  }

  generateWaferMap(dieCount: number) {
    const waferMapDies = this.generateDies(dieCount);
    const waferMap = document.createElement(waferMapTag)
    waferMap.dies = waferMapDies;
    waferMap.colorScale = {
      colors: ['red', 'orange', 'yellow', 'green'],
      values: ['1', '33', '66', '100']
    };
    document.body.append(waferMap);
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
          wafermapDieSet.push({ x: i, y: j, value: `${(i + j) % 100}` });
        }
      }
    }
    return wafermapDieSet;
  }
}
