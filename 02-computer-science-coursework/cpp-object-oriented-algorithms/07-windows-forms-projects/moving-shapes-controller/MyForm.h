#pragma once
#include "Clases.h"
namespace Jean {

	using namespace System;
	using namespace System::ComponentModel;
	using namespace System::Collections;
	using namespace System::Windows::Forms;
	using namespace System::Data;
	using namespace System::Drawing;

	/// <summary>
	/// Resumen de MyForm
	/// </summary>
	public ref class MyForm : public System::Windows::Forms::Form
	{
	public:
		MyForm(void)
		{
			InitializeComponent();
			controlador = new Controlador();
			timer = gcnew Timer();
			r = gcnew Random();  // Inicializamos el generador de números aleatorios
			timer->Interval = 50;  // Intervalo de 50 ms
			timer->Tick += gcnew EventHandler(this, &MyForm::OnTimerTick);
			timer->Start();  // Iniciar el temporizador
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
			delete controlador;
		}

	private:
		Timer^ timer;
		Controlador* controlador;
		System::ComponentModel::Container ^components;
		Random^ r;

#pragma region Windows Form Designer generated code
		/// <summary>
		/// Método necesario para admitir el Diseñador. No se puede modificar
		/// el contenido de este método con el editor de código.
		/// </summary>
		void InitializeComponent(void)
		{
			this->SuspendLayout();
			// 
			// MyForm
			// 
			this->AutoScaleDimensions = System::Drawing::SizeF(8, 16);
			this->AutoScaleMode = System::Windows::Forms::AutoScaleMode::Font;
			this->ClientSize = System::Drawing::Size(1032, 953);
			this->KeyPreview = true;
			this->Name = L"MyForm";
			this->Text = L"MyForm";
			this->ResumeLayout(false);

		}
#pragma endregion
		// Método que se ejecuta cada vez que el Timer hace "tick"
		void OnTimerTick(System::Object^ sender, System::EventArgs^ e) {
			if (r->Next(1000) % 50 == 0) {  // Generar círculos de manera aleatoria
				controlador->agregarCirculo();
			}
			this->Invalidate();  // Forzar el repintado del formulario
		}
		// Método que maneja las teclas presionadas
		void OnKeyDown(System::Object^ sender, System::Windows::Forms::KeyEventArgs^ e) {
			if (e->KeyCode == Keys::Space) {
				controlador->agregarTriangulo();  // Crear un triángulo al presionar la barra espaciadora
			}
		}
		// Método que dibuja las figuras
		void OnPaint(System::Object^ sender, System::Windows::Forms::PaintEventArgs^ e) {
			Graphics^ g = e->Graphics;
			controlador->dibujarFiguras(g);  // Dibujar todas las figuras
			controlador->colision();  // Verificar colisiones
		}
	};
}
