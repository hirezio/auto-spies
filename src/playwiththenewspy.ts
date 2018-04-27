import { Observable } from "rxjs";
import { Spy } from "./spy-types";

interface Ibla {
    a: Promise<string>;
    b: Observable<number>;
    c(a: Date): number;
    d(a: Date): Observable<number>;
    e(a: Date): Promise<string>;
    f: string;
  }
  
  type IblaWithSpy = Spy<Ibla>;
  
  declare const fooBar: IblaWithSpy;
  
  fooBar.a;
  fooBar.b;
  fooBar.c(new Date());
  fooBar.d.and.nextWith(1);
  fooBar.e.and.resolveWith("bla");
  fooBar.f;