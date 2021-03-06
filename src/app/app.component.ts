import { Component, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Form } from './form';
import { Experiment } from './experiment'
import { FormServiceService } from '../form-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  closeResult: string;
  uploadForm: FormGroup;
  httpClient: HttpClient;
  SERVER_URL: any = "";
  loadTable: boolean = false;
  loadExperiment: boolean = false;
  //LIST FormData
  previousData: Form[];
  displayedColumns = ['ID', 'Name'];
  displayedColumns_Exp = ['Experiment ID', 'Name'];
  previousExperiment: Experiment[];

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private formService: FormServiceService
  ) { }
  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      profile: [""]
    });
    this.loadTable = true;
    this.loadExperiment = true;
    //For loading previous dataSets and experiment data.
    this.getDataset();
    this.getExperiment();
  }
  //Making GET request from service for Experiment table:
  getDataset() {
    this.formService.getData().subscribe(data => this.previousData = data);
  }
  getExperiment() {
    this.formService.getExperiment().subscribe(data => this.previousExperiment = data);
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(event.target.files[0]);
      this.uploadForm.get("profile").setValue(file);
    }
  }
  //On submitting setting file to server.
  onSubmit() {
    const formData = new FormData();
    formData.append("file", this.uploadForm.get("profile").value);

    this.httpClient
      .post<any>(this.SERVER_URL, formData)
      .subscribe(res => console.log(res), err => console.log(err));
    close();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
