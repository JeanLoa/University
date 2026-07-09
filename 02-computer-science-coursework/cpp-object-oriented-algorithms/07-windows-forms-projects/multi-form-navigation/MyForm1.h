#pragma once
#include "MyForm2.h"

using namespace System;
using namespace System::ComponentModel;
using namespace System::Collections;
using namespace System::Windows::Forms;
using namespace System::Data;
using namespace System::Drawing;

namespace Algoritmos {

	using namespace System;
	using namespace System::ComponentModel;
	using namespace System::Collections;
	using namespace System::Windows::Forms;
	using namespace System::Data;
	using namespace System::Drawing;
	/// <summary>
	/// Resumen de MyForm
	/// </summary>
	public ref class MyForm1 : public System::Windows::Forms::Form
	{
	public:
		MyForm1(void)
		{
			InitializeComponent();
			//
			//TODO: agregar código de constructor aquí
			//
		}
		void setNombre(String^ nombre) {
			this->nombre = nombre;
		}
		void muestraNombre() {
			this->lbNombre->Text = "Bienvenido " + nombre;
			CenterLabel(this->lbNombre);
		}
		void muestraGanador(String^ ganador) {
			this->lbTriunfador->Text = nombre + " ha querido que gane " + ganador;
			CenterLabel(this->lbTriunfador);
		}
	protected:
		/// <summary>
		/// Limpiar los recursos que se estén usando.
		/// </summary>
		~MyForm1()
		{
			if (components)
			{
				delete components;
			}
		}
	private:
		System::Windows::Forms::Button^ btPreguntar;
		System::Windows::Forms::Label^ lbNombre;
		System::Windows::Forms::Label^ lbGanador;
		System::Windows::Forms::Label^ lbTriunfador;
		String^ nombre;
		void CenterLabel(Label^ label) {
			if (label != nullptr && label->Visible) {
				label->Location = System::Drawing::Point(
					(this->ClientSize.Width - label->Size.Width) / 2,
					label->Location.Y
				);
			}
		}

	private:
		/// <summary>
		/// Variable del diseñador necesaria.
		/// </summary>
		System::ComponentModel::Container ^components;

#pragma region Windows Form Designer generated code
		/// <summary>
		/// Método necesario para admitir el Diseñador. No se puede modificar
		/// el contenido de este método con el editor de código.
		/// </summary>
		void InitializeComponent(void)
		{
			this->btPreguntar = (gcnew System::Windows::Forms::Button());
			this->lbNombre = (gcnew System::Windows::Forms::Label());
			this->lbGanador = (gcnew System::Windows::Forms::Label());
			this->lbTriunfador = (gcnew System::Windows::Forms::Label());
			this->SuspendLayout();
			// 
			// btPreguntar
			// 
			this->btPreguntar->Location = System::Drawing::Point(142, 120);
			this->btPreguntar->Name = L"btPreguntar";
			this->btPreguntar->Size = System::Drawing::Size(149, 43);
			this->btPreguntar->TabIndex = 0;
			this->btPreguntar->Text = L"Preguntar";
			this->btPreguntar->UseVisualStyleBackColor = true;
			this->btPreguntar->Click += gcnew System::EventHandler(this, &MyForm1::btPreguntar_Click);
			// 
			// lbNombre
			// 
			this->lbNombre->AutoSize = true;
			this->lbNombre->Location = System::Drawing::Point(160, 78);
			this->lbNombre->Name = L"lbNombre";
			this->lbNombre->Size = System::Drawing::Size(11, 16);
			this->lbNombre->TabIndex = 1;
			this->lbNombre->Text = L"-";
			// 
			// lbGanador
			// 
			this->lbGanador->AutoSize = true;
			this->lbGanador->Location = System::Drawing::Point(210, 214);
			this->lbGanador->Name = L"lbGanador";
			this->lbGanador->Size = System::Drawing::Size(0, 16);
			this->lbGanador->TabIndex = 2;
			// 
			// lbTriunfador
			// 
			this->lbTriunfador->AutoSize = true;
			this->lbTriunfador->Location = System::Drawing::Point(118, 214);
			this->lbTriunfador->Name = L"lbTriunfador";
			this->lbTriunfador->Size = System::Drawing::Size(11, 16);
			this->lbTriunfador->TabIndex = 3;
			this->lbTriunfador->Text = L"-";
			// 
			// MyForm1
			// 
			this->AutoScaleDimensions = System::Drawing::SizeF(8, 16);
			this->AutoScaleMode = System::Windows::Forms::AutoScaleMode::Font;
			this->ClientSize = System::Drawing::Size(450, 314);
			this->Controls->Add(this->lbTriunfador);
			this->Controls->Add(this->lbGanador);
			this->Controls->Add(this->lbNombre);
			this->Controls->Add(this->btPreguntar);
			this->Name = L"MyForm1";
			this->Text = L"Pregunta";
			this->ResumeLayout(false);
			this->PerformLayout();

		}
#pragma endregion
	private: System::Void btPreguntar_Click(System::Object^ sender, System::EventArgs^ e) {
		MyForm2^ formGanador = gcnew MyForm2;
		formGanador->ShowDialog();
		muestraGanador(formGanador->getGanador());
	}
	};
}
