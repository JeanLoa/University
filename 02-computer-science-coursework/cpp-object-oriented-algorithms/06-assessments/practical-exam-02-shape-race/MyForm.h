#pragma once
#include "Clases.h"

namespace TareaJean {

	using namespace System;
	using namespace System::ComponentModel;
	using namespace System::Collections;
	using namespace System::Windows::Forms;
	using namespace System::Data;
	using namespace System::Drawing;

	/// <summary>
	/// Summary for MyForm
	/// </summary>
	public ref class MyForm : public System::Windows::Forms::Form
	{
	public:
		MyForm(void)
		{
			InitializeComponent();
			//
			//TODO: Add the constructor code here
			//
		}

	protected:
		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		~MyForm()
		{
			if (components)
			{
				delete components;
			}
		}
	private: System::Windows::Forms::Button^ btnInicio;
	private: System::Windows::Forms::Timer^ Timer;

	private: System::ComponentModel::IContainer^ components;
	private: System::Windows::Forms::Label^ lbMeta;
	protected:

	protected:

	private:
		Carrera* ObjCarrera;
		/// <summary>
		/// Required designer variable.
		/// </summary>


#pragma region Windows Form Designer generated code
		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		void InitializeComponent(void)
		{
			this->components = (gcnew System::ComponentModel::Container());
			this->btnInicio = (gcnew System::Windows::Forms::Button());
			this->Timer = (gcnew System::Windows::Forms::Timer(this->components));
			this->lbMeta = (gcnew System::Windows::Forms::Label());
			this->SuspendLayout();
			// 
			// btnInicio
			// 
			this->btnInicio->Location = System::Drawing::Point(535, 438);
			this->btnInicio->Name = L"btnInicio";
			this->btnInicio->Size = System::Drawing::Size(136, 23);
			this->btnInicio->TabIndex = 0;
			this->btnInicio->Text = L"Inicia Carrera";
			this->btnInicio->UseVisualStyleBackColor = true;
			this->btnInicio->Click += gcnew System::EventHandler(this, &MyForm::btnInicio_Click);
			// 
			// Timer
			// 
			this->Timer->Interval = 50;
			this->Timer->Tick += gcnew System::EventHandler(this, &MyForm::Timer_Tick);
			// 
			// lbMeta
			// 
			this->lbMeta->AutoSize = true;
			this->lbMeta->Location = System::Drawing::Point(640, 39);
			this->lbMeta->Name = L"lbMeta";
			this->lbMeta->Size = System::Drawing::Size(31, 13);
			this->lbMeta->TabIndex = 1;
			this->lbMeta->Text = L"Meta";
			// 
			// MyForm
			// 
			this->AutoScaleDimensions = System::Drawing::SizeF(6, 13);
			this->AutoScaleMode = System::Windows::Forms::AutoScaleMode::Font;
			this->ClientSize = System::Drawing::Size(1184, 509);
			this->Controls->Add(this->lbMeta);
			this->Controls->Add(this->btnInicio);
			this->Name = L"MyForm";
			this->Text = L"MyForm";
			this->Load += gcnew System::EventHandler(this, &MyForm::MyForm_Load);
			this->ResumeLayout(false);
			this->PerformLayout();

		}
#pragma endregion
	private: System::Void btnInicio_Click(System::Object^ sender, System::EventArgs^ e) {
		ObjCarrera = new Carrera;
		this->Timer->Start();
		btnInicio->Enabled = false;
		
		Graphics^ g = this->CreateGraphics();
		array<Point>^ points = gcnew array<Point> {
			Point(1000, 10),
			Point(1000, 400)
		};
		this->lbMeta->Visible = true;
		lbMeta->Location = Point(986, 2);
		g->DrawLine(Pens::Yellow, points[0], points[1]);
	}
	private: System::Void Timer_Tick(System::Object^ sender, System::EventArgs^ e) {
		Graphics^ g = this->CreateGraphics();
		int num = ObjCarrera->iniciarCarrera(g);
		if (num == 1) {
			this->Timer->Enabled = false;
			MessageBox::Show("El ganador de la carrera ha sido el CUADRADO", "Ganador", MessageBoxButtons::OK, MessageBoxIcon::Exclamation);
			this->Close();
		}
		else if (num == 2) {
			this->Timer->Enabled = false;
			MessageBox::Show("El ganador de la carrera ha sido el TRIANGULO", "Ganador", MessageBoxButtons::OK, MessageBoxIcon::Exclamation);
			this->Close();
		}
		else if (num == 3) {
			this->Timer->Enabled = false;
			MessageBox::Show("El ganador de la carrera ha sido el CIRCULO", "Ganador", MessageBoxButtons::OK, MessageBoxIcon::Exclamation);
			this->Close();
		}
	}
	private: System::Void MyForm_Load(System::Object^ sender, System::EventArgs^ e) {
		this->lbMeta->Visible = false;
	}
};
}
