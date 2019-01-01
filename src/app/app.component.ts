import { Component, OnInit, DoCheck } from '@angular/core';
import { CfgData } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck, OnInit {

  cfg_data: CfgData = new CfgData();
  yyyy: number;
  mm: number;
  dd: number;
  christian_era: number[] = this.setNumArr(this.cfg_data.MIN_ERA, this.cfg_data.MAX_ERA);
  month: number[] = this.setNumArr(1, 12);
  days: number[];
  show_star: string;
  ng_flg: boolean = false;

  ngOnInit() {
    if (localStorage.length == 3) {
      this.yyyy = Number(localStorage.getItem("y"));
      this.mm = Number(localStorage.getItem("m"));
      this.dd = Number(localStorage.getItem("d"));
    }
  }

  ngDoCheck() {
    this.days = undefined;
    this.setDays(this.yyyy, this.mm);
  }

  setNumArr(min: number, max: number): any {
    return [...Array(max - min + 1).keys()].map(num => num + min);
  }

  isLeapYear(y: number): boolean {
    return y % 4 == 0 && (y % 100 != 0 || y % 400 == 0);
  }

  isSmallMonth(m: number) {
    return m == 4 || m == 6 || m == 9 || m == 11;
  }

  setDays(yyyy: number, mm: number) {
    if (this.isLeapYear(yyyy) && mm == 2) {
      this.days = this.setNumArr(1, 29);
    } else if (mm == 2) {
      this.days = this.setNumArr(1, 28);
    } else if (this.isSmallMonth(mm)) {
      this.days = this.setNumArr(1, 30);
    } else {
      this.days = this.setNumArr(1, 31);
    }
  }

  getEto(y: number) {
    return this.cfg_data.ETO_ARR[y % 12];
  }

  getPm(eto: string): string {
    if (this.cfg_data.ETO_ARR.indexOf(eto) % 2 === 0) {
      return "＋";
    } else {
      return "ー";
    }
  }

  getUnmeiNum(y: number, m: number): number {
    let m_index = m - 1;
    let unmei_arr = this.cfg_data.STAR_NUM[y];
    unmei_arr = unmei_arr.split(',');
    let result = unmei_arr[m_index];
    return result;
  }

  calcStarNum(unmei_num: number, d: number): number {
    let calc_num = unmei_num - +1 + +d;
    if (60 < calc_num) {
      return calc_num - 60;
    } else {
      return calc_num;
    }
  }

  nullCheck(...target_strs: any) {
    for (const target of target_strs) {
      if (!target) {
        this.ng_flg = true;
        throw new Error("生年月日を入力してください。");
        break;
      }
    }
  }

  getStar(y: number, m: number, d: number) {

    try {
      this.nullCheck(y, m, d);

      localStorage.setItem("y", y.toString());
      localStorage.setItem("m", m.toString());
      localStorage.setItem("d", d.toString());

      let unmei_num = this.getUnmeiNum(y, m);
      let star_num = this.calcStarNum(unmei_num, d);
      let eto_str = this.getEto(y);
      let pm_str = this.getPm(eto_str);

      let star = "";

      if (star_num <= 10) {
        if (eto_str == this.cfg_data.ETO_ARR[2] || eto_str == this.cfg_data.ETO_ARR[3]) {
          star = "【" + this.cfg_data.STAR[0] + "】" + this.cfg_data.STAR[1];
        } else {
          star = this.cfg_data.STAR[1];
        }
      } else if (star_num <= 20) {
        if (eto_str == this.cfg_data.ETO_ARR[0] || eto_str == this.cfg_data.ETO_ARR[1]) {
          star = "【" + this.cfg_data.STAR[0] + "】" + this.cfg_data.STAR[2];
        } else {
          star = this.cfg_data.STAR[2];
        }
      } else if (star_num <= 30) {
        if (eto_str == this.cfg_data.ETO_ARR[10] || eto_str == this.cfg_data.ETO_ARR[11]) {
          star = "【" + this.cfg_data.STAR[0] + "】" + this.cfg_data.STAR[3];
        } else {
          star = this.cfg_data.STAR[3];
        }
      } else if (star_num <= 40) {
        if (eto_str == this.cfg_data.ETO_ARR[8] || eto_str == this.cfg_data.ETO_ARR[9]) {
          star = "【" + this.cfg_data.STAR[0] + "】" + this.cfg_data.STAR[4];
        } else {
          star = this.cfg_data.STAR[4];
        }
      } else if (star_num <= 50) {
        if (eto_str == this.cfg_data.ETO_ARR[6] || eto_str == this.cfg_data.ETO_ARR[7]) {
          star = "【" + this.cfg_data.STAR[0] + "】" + this.cfg_data.STAR[5];
        } else {
          star = this.cfg_data.STAR[5];
        }
      } else if (star_num <= 60) {
        if (eto_str == this.cfg_data.ETO_ARR[4] || eto_str == this.cfg_data.ETO_ARR[5]) {
          star = "【" + this.cfg_data.STAR[0] + "】" + this.cfg_data.STAR[6];
        } else {
          star = this.cfg_data.STAR[6];
        }
      }

      this.show_star = star + "（" + pm_str + "）";
    } catch (error) {
      alert(error.message);
    }
  }
}
