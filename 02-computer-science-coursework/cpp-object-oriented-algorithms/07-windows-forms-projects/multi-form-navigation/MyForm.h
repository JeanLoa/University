#pragma once
#include "MyForm1.h"
namespace Algoritmos {

	using namespace System;
	using namespace System::ComponentModel;
	using namespace System::Collections;
	using namespace System::Windows::Forms;
	using namespace System::Data;
	using namespace System::Drawing;

	/// <summary>
	/// Resumen de MyForm1
	/// </summary>
	public ref class MyForm : public System::Windows::Forms::Form
	{
	public:
		MyForm(void)
		{
			InitializeComponent();
			//
			//TODO: agregar código de constructor aquí
			//
		}

	protected:
		/// <summary>
		/// Limpiar los recursos que se estén usando.
		/// </summary>
		~MyForm()
		{
			if (components)
			{
				delete components;
			}
		}
	private: System::Windows::Forms::Label^ lbBienvenida;
	protected:
	private: System::Windows::Forms::Label^ lbIngresar;
	private: System::Windows::Forms::TextBox^ tbNombre;
	private: System::Windows::Forms::Button^ btEntrar;

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
			this->lbBienvenida = (gcnew System::Windows::Forms::Label());
			this->lbIngresar = (gcnew System::Windows::Forms::Label());
			this->tbNombre = (gcnew System::Windows::Forms::TextBox());
			this->btEntrar = (gcnew System::Windows::Forms::Button());
			this->SuspendLayout();
			// 
			// lbBienvenida
			// 
			this->lbBienvenida->AutoSize = true;
			this->lbBienvenida->Location = System::Drawing::Point(181, 99);
			this->lbBienvenida->Name = L"lbBienvenida";
			this->lbBienvenida->Size = System::Drawing::Size(75, 16);
			this->lbBienvenida->TabIndex = 0;
			this->lbBienvenida->Text = L"Bienvenido";
			// 
			// lbIngresar
			// 
			this->lbIngresar->AutoSize = true;
			this->lbIngresar->Location = System::Drawing::Point(105, 133);
			this->lbIngresar->Name = L"lbIngresar";
			this->lbIngresar->Size = System::Drawing::Size(117, 16);
			this->lbIngresar->TabIndex = 1;
			this->lbIngresar->Text = L"Ingresa tu nombre:";
			// 
			// tbNombre
			// 
			this->tbNombre->Location = System::Drawing::Point(241, 130);
			this->tbNombre->Name = L"tbNombre";
			this->tbNombre->Size = System::Drawing::Size(100, 22);
			this->tbNombre->TabIndex = 2;
			// 
			// btEntrar
			// 
			this->btEntrar->Location = System::Drawing::Point(181, 175);
			this->btEntrar->Name = L"btEntrar";
			this->btEntrar->Size = System::Drawing::Size(75, 23);
			this->btEntrar->TabIndex = 3;
			this->btEntrar->Text = L"Entrar";
			this->btEntrar->UseVisualStyleBackColor = true;
			this->btEntrar->Click += gcnew System::EventHandler(this, &MyForm::btEntrar_Click);
			// 
			// MyForm
			// 
			this->AutoScaleDimensions = System::Drawing::SizeF(8, 16);
			this->AutoScaleMode = System::Windows::Forms::AutoScaleMode::Font;
			this->ClientSize = System::Drawing::Size(450, 314);
			this->Controls->Add(this->btEntrar);
			this->Controls->Add(this->tbNombre);
			this->Controls->Add(this->lbIngresar);
			this->Controls->Add(this->lbBienvenida);
			this->Name = L"MyForm";
			this->Text = L"Bienvenida";
			this->ResumeLayout(false);
			this->PerformLayout();

		}
#pragma endregion
	private: System::Void btEntrar_Click(System::Object^ sender, System::EventArgs^ e) {
		if (this->tbNombre->Text == nullptr) {
			MessageBox::Show("Ingrese su nombre por favor", "Advertencia", MessageBoxButtons::OK, MessageBoxIcon::Warning);
			return;
		}
		else if (String::IsNullOrEmpty(this->tbNombre->Text)) {
			MessageBox::Show("Ingrese su nombre por favor", "Advertencia", MessageBoxButtons::OK, MessageBoxIcon::Warning);
			return;
		}
		else {
			MyForm1^ formPregunta = gcnew MyForm1();
			formPregunta->setNombre(tbNombre->Text);
			formPregunta->muestraNombre();
			formPregunta->Show();
		}
	}
	};
}
