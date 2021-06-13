import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { InsightsPage } from './insights.page';
import { InsightService } from './insights.service';
import { Insight } from './insight.model';

var testReflection: Insight;
const testUrl = 'api/record/insights';

describe('InsightsPage', () => {
  let component: InsightsPage;
  let fixture: ComponentFixture<InsightsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InsightsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

fdescribe('Http request testing', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let insightService: InsightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ InsightService ]

    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    insightService = TestBed.inject(InsightService)
  });

  fit('should get users reflection', () => {
    testReflection = {
      id: 'test',
      reflection: 'testing',
      tag: 'testing',
      posted_date: 'testing'
    }

    insightService.updateReflectionsFromServer().subscribe((data: Insight)=>{
      expect(data).toEqual(testReflection);
    })

    const req = httpMock.expectOne('api/record/insights');

    expect(req.request.method).toEqual("GET");

    req.flush(testReflection);

    httpMock.verify();
  });

  fit('add reflection and return it', () => {
    const reflection = 'testing';
    const tag = 'testing2';

    insightService.updateReflection(reflection, tag).subscribe(
      data => expect(data).toEqual(reflection, tag)
    );

    const req = httpMock.expectOne('api/record/insights');

    expect(req.request.method).toEqual("POST");

    req.flush(reflection);

    httpMock.verify();

  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMock.verify();
  });
})
