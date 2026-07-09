#pragma once
#include "Clases.h"

namespace Proyecto {

	using namespace System;
	using namespace System::ComponentModel;
	using namespace System::Collections;
	using namespace System::Windows::Forms;
	using namespace System::Data;
	using namespace System::Drawing;

	public ref class MyForm : public System::Windows::Forms::Form
	{
	public:
		MyForm(void)
		{
			InitializeComponent();
		}

	protected:
		~MyForm()
		{
			if (components)
			{
				delete components;
			}
		}
	private: System::Windows::Forms::Label^ lbElegir;
	private: System::Windows::Forms::Label^ lbPosicion;
	private: System::Windows::Forms::Label^ lbPosX;
	private: System::Windows::Forms::Label^ lbPosY;
	private: System::Windows::Forms::TextBox^ tbPosX;
	private: System::Windows::Forms::TextBox^ tbPosY;
	private: System::Windows::Forms::Button^ btDibujar;
	private: System::Windows::Forms::Label^ lbCirculo;
	private: System::Windows::Forms::Label^ lbRectangulo;
	protected:

	protected:








	private: System::Windows::Forms::Label^ lbRadio;
	private: System::Windows::Forms::TextBox^ tbRadio;
	private: System::Windows::Forms::Label^ lbArea1;

	private: System::Windows::Forms::Label^ lbAreaCirculo;
	private: System::Windows::Forms::Label^ lbLado1Rectangulo;
	private: System::Windows::Forms::Label^ lbLado2Rectangulo;
	private: System::Windows::Forms::TextBox^ tbLado1Rectangulo;
	private: System::Windows::Forms::TextBox^ tbLado2Rectangulo;
	private: System::Windows::Forms::Label^ lbArea2;
	private: System::Windows::Forms::Label^ lbAreaRectangulo;
	private: System::Windows::Forms::Panel^ pnDibujar;

	private: System::Windows::Forms::ComboBox^ cbFigura;

	private: System::ComponentModel::Container^ components;
		String^ figuraSeleccionada = "";
		ArrayCirculos* array_circulos = new ArrayCirculos;
		Circulo* circulo;
		ArrayRectangulos* array_rectangulos = new ArrayRectangulos;
	private: System::Windows::Forms::Panel^ pnControles;

		   Rectangulo* rectangulo;

#pragma region Windows Form Designer generated code
		void InitializeComponent(void)
		{
			this->lbElegir = (gcnew System::Windows::Forms::Label());
			this->lbPosicion = (gcnew System::Windows::Forms::Label());
			this->lbPosX = (gcnew System::Windows::Forms::Label());
			this->lbPosY = (gcnew System::Windows::Forms::Label());
			this->tbPosX = (gcnew System::Windows::Forms::TextBox());
			this->tbPosY = (gcnew System::Windows::Forms::TextBox());
			this->btDibujar = (gcnew System::Windows::Forms::Button());
			this->lbCirculo = (gcnew System::Windows::Forms::Label());
			this->lbRectangulo = (gcnew System::Windows::Forms::Label());
			this->lbRadio = (gcnew System::Windows::Forms::Label());
			this->tbRadio = (gcnew System::Windows::Forms::TextBox());
			this->lbArea1 = (gcnew System::Windows::Forms::Label());
			this->lbAreaCirculo = (gcnew System::Windows::Forms::Label());
			this->lbLado1Rectangulo = (gcnew System::Windows::Forms::Label());
			this->lbLado2Rectangulo = (gcnew System::Windows::Forms::Label());
			this->tbLado1Rectangulo = (gcnew System::Windows::Forms::TextBox());
			this->tbLado2Rectangulo = (gcnew System::Windows::Forms::TextBox());
			this->lbArea2 = (gcnew System::Windows::Forms::Label());
			this->lbAreaRectangulo = (gcnew System::Windows::Forms::Label());
			this->pnDibujar = (gcnew System::Windows::Forms::Panel());
			this->cbFigura = (gcnew System::Windows::Forms::ComboBox());
			this->pnControles = (gcnew System::Windows::Forms::Panel());
			this->pnControles->SuspendLayout();
			this->SuspendLayout();
			// 
			// lbElegir
			// 
			this->lbElegir->AutoSize = true;
			this->lbElegir->Location = System::Drawing::Point(207, 18);
			this->lbElegir->Name = L"lbElegir";
			this->lbElegir->Size = System::Drawing::Size(78, 16);
			this->lbElegir->TabIndex = 0;
			this->lbElegir->Text = L"Elegir figura";
			// 
			// lbPosicion
			// 
			this->lbPosicion->AutoSize = true;
			this->lbPosicion->Location = System::Drawing::Point(35, 54);
			this->lbPosicion->Name = L"lbPosicion";
			this->lbPosicion->Size = System::Drawing::Size(96, 16);
			this->lbPosicion->TabIndex = 1;
			this->lbPosicion->Text = L"Posición inicial";
			// 
			// lbPosX
			// 
			this->lbPosX->AutoSize = true;
			this->lbPosX->Location = System::Drawing::Point(35, 83);
			this->lbPosX->Name = L"lbPosX";
			this->lbPosX->Size = System::Drawing::Size(88, 16);
			this->lbPosX->TabIndex = 2;
			this->lbPosX->Text = L"Posición en X";
			// 
			// lbPosY
			// 
			this->lbPosY->AutoSize = true;
			this->lbPosY->Location = System::Drawing::Point(35, 111);
			this->lbPosY->Name = L"lbPosY";
			this->lbPosY->Size = System::Drawing::Size(89, 16);
			this->lbPosY->TabIndex = 3;
			this->lbPosY->Text = L"Posición en Y";
			// 
			// tbPosX
			// 
			this->tbPosX->Location = System::Drawing::Point(129, 80);
			this->tbPosX->Name = L"tbPosX";
			this->tbPosX->Size = System::Drawing::Size(100, 22);
			this->tbPosX->TabIndex = 4;
			// 
			// tbPosY
			// 
			this->tbPosY->Location = System::Drawing::Point(129, 108);
			this->tbPosY->Name = L"tbPosY";
			this->tbPosY->Size = System::Drawing::Size(100, 22);
			this->tbPosY->TabIndex = 5;
			// 
			// btDibujar
			// 
			this->btDibujar->BackColor = System::Drawing::SystemColors::Control;
			this->btDibujar->FlatStyle = System::Windows::Forms::FlatStyle::Popup;
			this->btDibujar->ForeColor = System::Drawing::SystemColors::ActiveCaptionText;
			this->btDibujar->Location = System::Drawing::Point(124, 166);
			this->btDibujar->Name = L"btDibujar";
			this->btDibujar->Size = System::Drawing::Size(352, 23);
			this->btDibujar->TabIndex = 6;
			this->btDibujar->Text = L"Dibujar";
			this->btDibujar->UseVisualStyleBackColor = false;
			this->btDibujar->Click += gcnew System::EventHandler(this, &MyForm::btDibujar_Click);
			// 
			// lbCirculo
			// 
			this->lbCirculo->AutoSize = true;
			this->lbCirculo->Location = System::Drawing::Point(266, 56);
			this->lbCirculo->Name = L"lbCirculo";
			this->lbCirculo->Size = System::Drawing::Size(48, 16);
			this->lbCirculo->TabIndex = 7;
			this->lbCirculo->Text = L"Circulo";
			// 
			// lbRectangulo
			// 
			this->lbRectangulo->AutoSize = true;
			this->lbRectangulo->Location = System::Drawing::Point(451, 54);
			this->lbRectangulo->Name = L"lbRectangulo";
			this->lbRectangulo->Size = System::Drawing::Size(76, 16);
			this->lbRectangulo->TabIndex = 8;
			this->lbRectangulo->Text = L"Rectángulo";
			// 
			// lbRadio
			// 
			this->lbRadio->AutoSize = true;
			this->lbRadio->Location = System::Drawing::Point(267, 85);
			this->lbRadio->Name = L"lbRadio";
			this->lbRadio->Size = System::Drawing::Size(44, 16);
			this->lbRadio->TabIndex = 9;
			this->lbRadio->Text = L"Radio";
			// 
			// tbRadio
			// 
			this->tbRadio->Location = System::Drawing::Point(317, 82);
			this->tbRadio->Name = L"tbRadio";
			this->tbRadio->Size = System::Drawing::Size(64, 22);
			this->tbRadio->TabIndex = 10;
			// 
			// lbArea1
			// 
			this->lbArea1->AutoSize = true;
			this->lbArea1->Location = System::Drawing::Point(268, 113);
			this->lbArea1->Name = L"lbArea1";
			this->lbArea1->Size = System::Drawing::Size(36, 16);
			this->lbArea1->TabIndex = 11;
			this->lbArea1->Text = L"Area";
			// 
			// lbAreaCirculo
			// 
			this->lbAreaCirculo->AutoSize = true;
			this->lbAreaCirculo->Location = System::Drawing::Point(343, 114);
			this->lbAreaCirculo->Name = L"lbAreaCirculo";
			this->lbAreaCirculo->Size = System::Drawing::Size(11, 16);
			this->lbAreaCirculo->TabIndex = 12;
			this->lbAreaCirculo->Text = L"-";
			// 
			// lbLado1Rectangulo
			// 
			this->lbLado1Rectangulo->AutoSize = true;
			this->lbLado1Rectangulo->Location = System::Drawing::Point(451, 83);
			this->lbLado1Rectangulo->Name = L"lbLado1Rectangulo";
			this->lbLado1Rectangulo->Size = System::Drawing::Size(48, 16);
			this->lbLado1Rectangulo->TabIndex = 13;
			this->lbLado1Rectangulo->Text = L"Lado 1";
			// 
			// lbLado2Rectangulo
			// 
			this->lbLado2Rectangulo->AutoSize = true;
			this->lbLado2Rectangulo->Location = System::Drawing::Point(451, 111);
			this->lbLado2Rectangulo->Name = L"lbLado2Rectangulo";
			this->lbLado2Rectangulo->Size = System::Drawing::Size(48, 16);
			this->lbLado2Rectangulo->TabIndex = 14;
			this->lbLado2Rectangulo->Text = L"Lado 2";
			// 
			// tbLado1Rectangulo
			// 
			this->tbLado1Rectangulo->Location = System::Drawing::Point(509, 109);
			this->tbLado1Rectangulo->Name = L"tbLado1Rectangulo";
			this->tbLado1Rectangulo->Size = System::Drawing::Size(64, 22);
			this->tbLado1Rectangulo->TabIndex = 15;
			// 
			// tbLado2Rectangulo
			// 
			this->tbLado2Rectangulo->Location = System::Drawing::Point(509, 80);
			this->tbLado2Rectangulo->Name = L"tbLado2Rectangulo";
			this->tbLado2Rectangulo->Size = System::Drawing::Size(64, 22);
			this->tbLado2Rectangulo->TabIndex = 16;
			// 
			// lbArea2
			// 
			this->lbArea2->AutoSize = true;
			this->lbArea2->Location = System::Drawing::Point(453, 140);
			this->lbArea2->Name = L"lbArea2";
			this->lbArea2->Size = System::Drawing::Size(36, 16);
			this->lbArea2->TabIndex = 17;
			this->lbArea2->Text = L"Area";
			// 
			// lbAreaRectangulo
			// 
			this->lbAreaRectangulo->AutoSize = true;
			this->lbAreaRectangulo->Location = System::Drawing::Point(536, 140);
			this->lbAreaRectangulo->Name = L"lbAreaRectangulo";
			this->lbAreaRectangulo->Size = System::Drawing::Size(11, 16);
			this->lbAreaRectangulo->TabIndex = 18;
			this->lbAreaRectangulo->Text = L"-";
			// 
			// pnDibujar
			// 
			this->pnDibujar->BorderStyle = System::Windows::Forms::BorderStyle::FixedSingle;
			this->pnDibujar->Location = System::Drawing::Point(12, 220);
			this->pnDibujar->Name = L"pnDibujar";
			this->pnDibujar->Size = System::Drawing::Size(610, 251);
			this->pnDibujar->TabIndex = 19;
			this->pnDibujar->Paint += gcnew System::Windows::Forms::PaintEventHandler(this, &MyForm::panelDibujo_Paint);
			// 
			// cbFigura
			// 
			this->cbFigura->FormattingEnabled = true;
			this->cbFigura->Items->AddRange(gcnew cli::array< System::Object^  >(2) { L"Rectangulo", L"Circulo" });
			this->cbFigura->Location = System::Drawing::Point(291, 15);
			this->cbFigura->Name = L"cbFigura";
			this->cbFigura->Size = System::Drawing::Size(105, 24);
			this->cbFigura->TabIndex = 20;
			this->cbFigura->SelectedIndexChanged += gcnew System::EventHandler(this, &MyForm::cbFigura_SelectedIndexChanged);
			// 
			// pnControles
			// 
			this->pnControles->Controls->Add(this->lbPosX);
			this->pnControles->Controls->Add(this->cbFigura);
			this->pnControles->Controls->Add(this->lbRectangulo);
			this->pnControles->Controls->Add(this->lbPosY);
			this->pnControles->Controls->Add(this->btDibujar);
			this->pnControles->Controls->Add(this->tbPosY);
			this->pnControles->Controls->Add(this->tbLado2Rectangulo);
			this->pnControles->Controls->Add(this->lbAreaRectangulo);
			this->pnControles->Controls->Add(this->lbElegir);
			this->pnControles->Controls->Add(this->lbPosicion);
			this->pnControles->Controls->Add(this->tbLado1Rectangulo);
			this->pnControles->Controls->Add(this->tbPosX);
			this->pnControles->Controls->Add(this->lbLado1Rectangulo);
			this->pnControles->Controls->Add(this->lbLado2Rectangulo);
			this->pnControles->Controls->Add(this->lbArea2);
			this->pnControles->Controls->Add(this->lbArea1);
			this->pnControles->Controls->Add(this->lbRadio);
			this->pnControles->Controls->Add(this->lbCirculo);
			this->pnControles->Controls->Add(this->tbRadio);
			this->pnControles->Controls->Add(this->lbAreaCirculo);
			this->pnControles->Location = System::Drawing::Point(12, 12);
			this->pnControles->Name = L"pnControles";
			this->pnControles->Size = System::Drawing::Size(610, 202);
			this->pnControles->TabIndex = 21;
			// 
			// MyForm
			// 
			this->AutoScaleDimensions = System::Drawing::SizeF(8, 16);
			this->AutoScaleMode = System::Windows::Forms::AutoScaleMode::Font;
			this->ClientSize = System::Drawing::Size(634, 483);
			this->Controls->Add(this->pnControles);
			this->Controls->Add(this->pnDibujar);
			this->MinimumSize = System::Drawing::Size(652, 530);
			this->Name = L"MyForm";
			this->Text = L"MyForm";
			this->Load += gcnew System::EventHandler(this, &MyForm::MyForm_Load);
			this->pnControles->ResumeLayout(false);
			this->pnControles->PerformLayout();
			this->ResumeLayout(false);

		}
		
		// Evento Paint del panel para dibujar las figuras
		void panelDibujo_Paint(System::Object^ sender, System::Windows::Forms::PaintEventArgs^ e) {
			// Crear un objeto Graphics para dibujar
			Graphics^ g = e->Graphics;

			// Dibujar el círculo si es la figura seleccionada
			if (figuraSeleccionada == "Circulo") {
				int radio;
				int x = Convert::ToInt32(tbPosX->Text);
				int y = Convert::ToInt32(tbPosY->Text);
				if (Int32::TryParse(tbRadio->Text, radio)) {
					circulo->dibujar(g, x, y);
				}
			}
			// Dibujar el rectángulo si es la figura seleccionada
			else if (figuraSeleccionada == "Rectangulo") {
				int lado1, lado2;
				int x = Convert::ToInt32(tbPosX->Text);
				int y = Convert::ToInt32(tbPosY->Text);
				if (Int32::TryParse(tbLado1Rectangulo->Text, lado1) && Int32::TryParse(tbLado2Rectangulo->Text, lado2)) {
					rectangulo->dibujarRectangulo(g, x, y);
				}
			}
		}
		void btDibujar_Click(System::Object^ sender, System::EventArgs^ e)
		{
			if (this->cbFigura->SelectedItem == nullptr) {  // Verificar si no se ha seleccionado ninguna opción
				MessageBox::Show("Seleccione una figura válida por favor", "Advertencia", MessageBoxButtons::OK, MessageBoxIcon::Warning);
				return;
			}
			figuraSeleccionada = this->cbFigura->SelectedItem->ToString();
			if (figuraSeleccionada != "Circulo" && figuraSeleccionada != "Rectangulo" || this->cbFigura->SelectedItem == nullptr) {  // Ninguna opción seleccionada
				MessageBox::Show("Seleccione una figura válida por favor", "Advertencia", MessageBoxButtons::OK, MessageBoxIcon::Warning);
				return;
			}
			if (this->cbFigura->SelectedItem->ToString() == "Circulo")
			{
				if (String::IsNullOrEmpty(tbRadio->Text) || String::IsNullOrEmpty(tbPosX->Text) || String::IsNullOrEmpty(tbPosY->Text)) {
					MessageBox::Show("Los campos no pueden estar vacios", "Advertencia", MessageBoxButtons::OK, MessageBoxIcon::Warning);
					return;
				}
				double radio = Convert::ToDouble(this->tbRadio->Text);
				circulo = new Circulo(radio);
				this->lbAreaCirculo->Text = circulo->Area().ToString();
				array_circulos->agregarCirculo(circulo);
			}
			else if (this->cbFigura->SelectedItem->ToString() == "Rectangulo")
			{
				if (String::IsNullOrEmpty(tbLado1Rectangulo->Text) || String::IsNullOrEmpty(tbLado2Rectangulo->Text) || String::IsNullOrEmpty(tbPosX->Text) || String::IsNullOrEmpty(tbPosY->Text)) {
					MessageBox::Show("Los campos no pueden estar vacios", "Advertencia", MessageBoxButtons::OK, MessageBoxIcon::Warning);
					return;
				}
				double lado1 = Convert::ToDouble(this->tbLado1Rectangulo->Text);
				double lado2 = Convert::ToDouble(this->tbLado2Rectangulo->Text);
				rectangulo = new Rectangulo(lado1, lado2);
				this->lbAreaRectangulo->Text = rectangulo->Area().ToString();
				array_rectangulos->agregarRectangulo(rectangulo);
			}
			// Lógica para dibujar la figura y calcular el área
			double posX = Convert::ToDouble(this->tbPosX->Text);
			double posY = Convert::ToDouble(this->tbPosY->Text);
			figuraSeleccionada = this->cbFigura->SelectedItem->ToString();
			pnDibujar->Invalidate();  // Forzar que el panel se repinte

		}
		void cbFigura_SelectedIndexChanged(System::Object^ sender, System::EventArgs^ e) {
			btDibujar->Enabled = true;
			lbPosicion->Enabled = true;
			lbPosX->Enabled = true;
			tbPosX->Enabled = true;
			lbPosY->Enabled = true;
			tbPosY->Enabled = true;
			lbCirculo->Enabled = false;
			lbRectangulo->Enabled = false;
			lbArea1->Enabled = false;
			lbArea2->Enabled = false;
			lbAreaCirculo->Enabled = false;
			lbAreaRectangulo->Enabled = false;
			lbRadio->Enabled = false;
			tbRadio->Enabled = false;
			lbLado1Rectangulo->Enabled = false;
			tbLado1Rectangulo->Enabled = false;
			lbLado2Rectangulo->Enabled = false;
			tbLado2Rectangulo->Enabled = false;
			this->tbPosX->Text = "";
			this->tbPosY->Text = "";
			if (this->cbFigura->SelectedItem->ToString() == "Circulo") {
				this->tbLado1Rectangulo->Text = "";
				this->tbLado2Rectangulo->Text = "";
				this->lbAreaRectangulo->Text = "";
				// Visibilidad
				lbCirculo->Enabled = true;
				lbArea1->Enabled = true;
				lbAreaCirculo->Enabled = true;
				lbRadio->Enabled = true;
				tbRadio->Enabled = true;
			}
			else if (this->cbFigura->SelectedItem->ToString() == "Rectangulo") {
				this->tbRadio->Text = "";
				this->lbAreaCirculo->Text = "";
				// Visibilidad
				lbRectangulo->Enabled = true;
				lbArea2->Enabled = true;
				lbAreaRectangulo->Enabled = true;
				lbLado1Rectangulo->Enabled = true;
				tbLado1Rectangulo->Enabled = true;
				lbLado2Rectangulo->Enabled = true;
				tbLado2Rectangulo->Enabled = true;
			}
		}
		void MyForm_Load(System::Object^ sender, System::EventArgs^ e) {
			lbAreaCirculo->Text = "";
			lbAreaRectangulo->Text = "";
			lbRadio->Enabled = false;
			tbRadio->Enabled = false;
			lbLado1Rectangulo->Enabled = false;
			tbLado1Rectangulo->Enabled = false;
			lbLado2Rectangulo->Enabled = false;
			tbLado2Rectangulo->Enabled = false;
			lbArea1->Enabled = false;
			lbArea2->Enabled = false;
			lbAreaCirculo->Enabled = false;
			lbAreaRectangulo->Enabled = false;
			lbPosX->Enabled = false;
			tbPosX->Enabled = false;
			lbPosY->Enabled = false;
			tbPosY->Enabled = false;
			lbPosicion->Enabled = false;
			lbCirculo->Enabled = false;
			lbRectangulo->Enabled = false;
			btDibujar->Enabled = false;
		}
};
}
