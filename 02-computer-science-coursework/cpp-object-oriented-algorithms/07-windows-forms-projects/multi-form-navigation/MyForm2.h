#pragma once

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
	public ref class MyForm2 : public System::Windows::Forms::Form
	{
	public:
		MyForm2(void)
		{
			InitializeComponent();
			//
			//TODO: agregar código de constructor aquí
			//
		}
		String^ getGanador() {
			return this->Ganador;
		}

	protected:
		/// <summary>
		/// Limpiar los recursos que se estén usando.
		/// </summary>
		~MyForm2()
		{
			if (components)
			{
				delete components;
			}
		}
	private: System::Windows::Forms::Label^ lbLucas;
	private: System::Windows::Forms::Button^ btPeru;
	private: System::Windows::Forms::Button^ btUruguay;
	protected:
		String^ Ganador;

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
			this->lbLucas = (gcnew System::Windows::Forms::Label());
			this->btPeru = (gcnew System::Windows::Forms::Button());
			this->btUruguay = (gcnew System::Windows::Forms::Button());
			this->SuspendLayout();
			// 
			// lbLucas
			// 
			this->lbLucas->AutoSize = true;
			this->lbLucas->Location = System::Drawing::Point(171, 98);
			this->lbLucas->Name = L"lbLucas";
			this->lbLucas->Size = System::Drawing::Size(102, 16);
			this->lbLucas->TabIndex = 2;
			this->lbLucas->Text = L"¿Quién ganará\?";
			// 
			// btPeru
			// 
			this->btPeru->Location = System::Drawing::Point(111, 171);
			this->btPeru->Name = L"btPeru";
			this->btPeru->Size = System::Drawing::Size(75, 23);
			this->btPeru->TabIndex = 3;
			this->btPeru->Text = L"Peru";
			this->btPeru->UseVisualStyleBackColor = true;
			this->btPeru->Click += gcnew System::EventHandler(this, &MyForm2::btPeru_Click);
			// 
			// btUruguay
			// 
			this->btUruguay->AllowDrop = true;
			this->btUruguay->Location = System::Drawing::Point(263, 171);
			this->btUruguay->Name = L"btUruguay";
			this->btUruguay->Size = System::Drawing::Size(75, 23);
			this->btUruguay->TabIndex = 4;
			this->btUruguay->Text = L"Uruguay";
			this->btUruguay->UseVisualStyleBackColor = true;
			this->btUruguay->Click += gcnew System::EventHandler(this, &MyForm2::btUruguay_Click);
			// 
			// MyForm2
			// 
			this->AutoScaleDimensions = System::Drawing::SizeF(8, 16);
			this->AutoScaleMode = System::Windows::Forms::AutoScaleMode::Font;
			this->ClientSize = System::Drawing::Size(450, 314);
			this->Controls->Add(this->btUruguay);
			this->Controls->Add(this->btPeru);
			this->Controls->Add(this->lbLucas);
			this->Name = L"MyForm2";
			this->Text = L"Ganador";
			this->ResumeLayout(false);
			this->PerformLayout();

		}
#pragma endregion
	private: System::Void btPeru_Click(System::Object^ sender, System::EventArgs^ e) {
		this->Ganador = "Peru";
		this->Close();

	}
	private: System::Void btUruguay_Click(System::Object^ sender, System::EventArgs^ e) {
		this->Ganador = "Uruguay";
		this->Close();
	}
	};
}
