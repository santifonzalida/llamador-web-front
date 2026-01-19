import { TestBed } from '@angular/core/testing';
import { DisplayScreenSocketService } from './display-screen-socket.service';

describe('DisplayScreenSocketService', () => {
  let service: DisplayScreenSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayScreenSocketService);
  });

  it('debe crear servicio display-screen-socket correctamente', () => {
    expect(service).toBeTruthy();
  });
});
 