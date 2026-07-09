#pragma once
#include "Clases.h"
#include "vector"

namespace Jean {

	using namespace System;
	using namespace System::ComponentModel;
	using namespace System::Collections;
	using namespace System::Windows::Forms;
	using namespace System::Data;
	using namespace System::Drawing;
	using namespace System::Collections::Generic;

	/// <summary>
	/// Resumen de MyForm
	/// </summary>
	public ref class MyForm : public System::Windows::Forms::Form
	{
	public:
		MyForm(void)
		{
			InitializeComponent();
			LoadFloors();
			LoadSprites();
			LoadWorlds();
			LoadPortals();
			this->KeyPreview = true;
			this->Focus();

			
			this->SetStyle(System::Windows::Forms::ControlStyles::UserPaint, true);
			this->SetStyle(System::Windows::Forms::ControlStyles::AllPaintingInWmPaint, true);
			this->SetStyle(System::Windows::Forms::ControlStyles::OptimizedDoubleBuffer, true);
			this->UpdateStyles();
			//
			//TODO: agregar código de constructor aquí
			//
		}
		void LoadFloors() {
			// Aumentar el ancho mas 50 y la altura mas 10 por imprecisiones del formulario
			suelos_1 = gcnew Suelos;
			suelos_1->agregarSuelo(gcnew Suelo(175, 522, 213, 35));
			suelos_1->agregarSuelo(gcnew Suelo(437, 457, 214, 35));
			suelos_1->agregarSuelo(gcnew Suelo(175, 298, 241, 35));
			suelos_1->agregarSuelo(gcnew Suelo(218, 171, 212, 35));
			suelos_1->agregarSuelo(gcnew Suelo(474, 205, 213, 35));
			suelos_1->agregarSuelo(gcnew Suelo(688, 544, 131, 35));
			suelos_1->agregarSuelo(gcnew Suelo(679, 352, 187, 35));
			suelos_1->agregarSuelo(gcnew Suelo(762, 156, 158, 35));
			suelos_1->agregarSuelo(gcnew Suelo(922, 271, 131, 35));
			suelos_1->agregarSuelo(gcnew Suelo(850, 422, 266, 35));
			suelos_1->agregarSuelo(gcnew Suelo(1091, 189, 186, 35));
			suelos_1->agregarSuelo(gcnew Suelo(1126, 326, 242, 35));
			suelos_1->agregarSuelo(gcnew Suelo(1141, 490, 214, 35));
			suelos_1->agregarSuelo(gcnew Suelo(1334, 550, 131, 35));

			suelos_2 = gcnew Suelos;
			suelos_2->agregarSuelo(gcnew Suelo(159, 548, 230, 35));
			suelos_2->agregarSuelo(gcnew Suelo(146, 378, 306, 35));
			suelos_2->agregarSuelo(gcnew Suelo(126, 175, 179, 35));
			suelos_2->agregarSuelo(gcnew Suelo(349, 250, 204, 35));
			suelos_2->agregarSuelo(gcnew Suelo(590, 134, 230, 35));
			suelos_2->agregarSuelo(gcnew Suelo(600, 311, 281, 35));
			suelos_2->agregarSuelo(gcnew Suelo(510, 507, 265, 35));
			suelos_2->agregarSuelo(gcnew Suelo(900, 204, 230, 35));
			suelos_2->agregarSuelo(gcnew Suelo(873, 428, 201, 35));
			suelos_2->agregarSuelo(gcnew Suelo(1258, 127, 230, 35));
			suelos_2->agregarSuelo(gcnew Suelo(1148, 354, 228, 35));
			suelos_2->agregarSuelo(gcnew Suelo(1092, 539, 253, 35));

			suelos_3 = gcnew Suelos;
			suelos_3->agregarSuelo(gcnew Suelo(131, 372, 241, 35));
			suelos_3->agregarSuelo(gcnew Suelo(239, 207, 214, 35));
			suelos_3->agregarSuelo(gcnew Suelo(347, 529, 294, 35));
			suelos_3->agregarSuelo(gcnew Suelo(457, 326, 213, 35));
			suelos_3->agregarSuelo(gcnew Suelo(542, 124, 239, 35));
			suelos_3->agregarSuelo(gcnew Suelo(684, 406, 269, 35));
			suelos_3->agregarSuelo(gcnew Suelo(864, 211, 241, 35));
			suelos_3->agregarSuelo(gcnew Suelo(840, 560, 185, 35));
			suelos_3->agregarSuelo(gcnew Suelo(1084, 497, 187, 35));
			suelos_3->agregarSuelo(gcnew Suelo(1147, 318, 239, 35));

			suelos_4 = gcnew Suelos;
			suelos_4->agregarSuelo(gcnew Suelo(139, 151, 255, 35));
			suelos_4->agregarSuelo(gcnew Suelo(192, 345, 204, 35));
			suelos_4->agregarSuelo(gcnew Suelo(373, 486, 203, 35));
			suelos_4->agregarSuelo(gcnew Suelo(447, 264, 204, 35));
			suelos_4->agregarSuelo(gcnew Suelo(700, 423, 178, 35));
			suelos_4->agregarSuelo(gcnew Suelo(907, 234, 230, 35));
			suelos_4->agregarSuelo(gcnew Suelo(1126, 314, 101, 35));
			suelos_4->agregarSuelo(gcnew Suelo(994, 497, 230, 35));
			suelos_4->agregarSuelo(gcnew Suelo(1268, 182, 204, 35));
			suelos_4->agregarSuelo(gcnew Suelo(1248, 385, 152, 35));

			suelos_5 = gcnew Suelos;
		}
		void LoadPortals() {
			// Aumentar el ancho mas 50 y la altura mas 10 por imprecisiones del formulario
			portal_1 = gcnew Portal(1182, 370, 80, 120, gcnew array<Image^>(1) {
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Portal1.jpg")
			});
			portal_2 = gcnew Portal(357, 70, 140, 180, gcnew array<Image^>(4) {
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Portal2_1.jpg"),
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Portal2_1.jpg"),
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Portal2_2.jpg"),
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Portal2_3.jpg")
			});
			/*
			portal_3 = gcnew Portal();
			portal_4 = gcnew Portal();
			portal_5 = gcnew Portal();
			*/
		}
		void LoadWorlds() {
			Graphics^ g = this->CreateGraphics();
			mundo_1 = gcnew Mundo (0,0, g->VisibleClipBounds.Width, g->VisibleClipBounds.Height, gcnew array<Image^>(1) {
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Mundo1.jpg")
			});
			mundo_2 = gcnew Mundo(0, 0, g->VisibleClipBounds.Width, g->VisibleClipBounds.Height, gcnew array<Image^>(1) {
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Mundo2.jpg")
			});
			mundo_3 = gcnew Mundo (0,0, g->VisibleClipBounds.Width, g->VisibleClipBounds.Height, gcnew array<Image^>(2) {
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Mundo3_0.jpg"),
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Mundo3_1.jpg")
			});
			mundo_4 = gcnew Mundo (0,0, g->VisibleClipBounds.Width, g->VisibleClipBounds.Height, gcnew array<Image^>(3) {
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Mundo4_0.jpg"),
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Mundo4_1.jpg"),
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Mundo4_2.jpg")
			});
			mundo_5 = gcnew Mundo (0,0, g->VisibleClipBounds.Width, g->VisibleClipBounds.Height, gcnew array<Image^>(5) {
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Mundo4_0.jpg"),
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Mundo4_1.jpg"),
					Image::FromFile("C:\\Users\\Asus\\Desktop\\Mundo4_2.jpg"),
			});
		}
		void LoadSprites() {
			sprites = gcnew array<Bitmap^>(34);

			// Carga cada sprite desde su ubicación
			sprites[0] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteDefaultRight1.png");
			sprites[1] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteDefaultRight2.png");
			
			sprites[2] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteDefaultLeft1.png");
			sprites[3] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteDefaultLeft2.png");

			sprites[4] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteRunRight1.png");
			sprites[5] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteRunRight2.png");
			sprites[6] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteRunRight3.png");

			sprites[7] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteRunLeft1.png");
			sprites[8] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteRunLeft2.png");
			sprites[9] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteRunLeft3.png");

			sprites[10] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteJumpRight1.png");
			sprites[11] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteJumpRight2.png");
			sprites[12] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteJumpLeft1.png");
			sprites[13] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteJumpLeft2.png");

			sprites[14] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteFallRight1.png");
			sprites[15] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteFallRight2.png");
			sprites[16] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteFallLeft1.png");
			sprites[17] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteFallLeft1.png");

			sprites[18] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpritePunchRight1.png");
			sprites[19] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpritePunchRight2.png");
			sprites[20] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpritePunchRight3.png");
			sprites[21] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpritePunchRight4.png");

			sprites[22] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpritePunchLeft1.png");
			sprites[23] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpritePunchLeft2.png");
			sprites[24] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpritePunchLeft3.png");
			sprites[25] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpritePunchLeft4.png");

			sprites[26] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteShootRight1.png");
			sprites[27] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteShootLeft1.png");

			sprites[28] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteSlidingRight1.png");
			sprites[29] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\SpriteSlidingLeft1.png");

			sprites[30] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\LimSpriteRunningRight1.png");
			sprites[31] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\LimSpriteRunningLeft1.png");
			
			sprites[32] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\LimSpriteFallingRight1.png");
			sprites[33] = gcnew Bitmap("C:\\Users\\Asus\\Desktop\\LimSpriteFallingLeft1.png");
		}

	protected:
		/// <summary>
		/// Limpiar los recursos que se estén usando.
		/// </summary>
		~MyForm()
		{
			if (components) {
				delete components;
			}
			for (int i = 0; i < sprites->Length; i++) {
				delete sprites[i];
			}
		}
	private: System::ComponentModel::IContainer^ components;
	protected:

	private:
		/// <summary>
		/// Variable del diseñador necesaria.
		/// </summary>
		array<Bitmap^>^ sprites; // Arreglo para almacenar tus sprites
	private: 

		System::Windows::Forms::Timer^ Timer;
		// Auxiliar
		float lapse = 0.0f;
		// Sprite
		int spriteIndex = 0;
		int spriteHeight;
		int spriteWidth;
		int spriteX = 100;
		int spriteY = 570 - margendeErrorY;
		// Determina el rango de índices de los sprites
		int startIndex = 0; // Índice inicial del sprite actual
		int endIndex = 1;   // Índice final para el ciclo de sprites
		// Movimientos
		bool sliding = false;
		float slideStrength = 20.0f;
		float slideSpeed;
		bool running = true;
		bool movingLeft = false;
		bool movingRight = false;
		// Salto y caida
		bool jumping = false;
		bool falling = false;
		float jumpStrength = 40.0f;
		float gravity = 5.0f;
		float aceleration = 2.0f;
		float jumpSpeed;
		int initialY;
		// Ataques
		bool punching = false;
		bool punchingStarted = false;
		bool shooting = false;
		// Suelos
		int defaultFloorY = 570;

		int margendeErrorY = 20;
		int margendeErrorX = 35;

		String^ lastMove = "";

		Portal^ portal_1;
		Portal^ portal_2;
		Portal^ portal_3;
		Portal^ portal_4;
		Portal^ portal_5;

		Image^ Portal1;
		Image^ Portal2;
		Image^ Portal3;
		Image^ Portal4;
		Image^ Portal5;
		int imagePortalIndex = 0;
		int imagePortalStartIndex = 0;
		int imagePortalEndIndex = 0;

		Suelos^ suelos_1;
		Suelos^ suelos_2;
		Suelos^ suelos_3;
		Suelos^ suelos_4;
		Suelos^ suelos_5;
		Suelos^ suelosActuales;

		bool val_mundo_1 = false;
		bool val_mundo_2 = false;
		bool val_mundo_3 = false;
		bool val_mundo_4 = false;
		bool val_mundo_5 = false;

		Mundo^ mundo_1;
		Mundo^ mundo_2;
		Mundo^ mundo_3;
		Mundo^ mundo_4;
		Mundo^ mundo_5;
		int imageWorldIndex = 0;
		int imageWorldStartIndex = 0;
		int imageWorldEndIndex = 0;
#pragma region Windows Form Designer generated code
		/// <summary>
		/// Método necesario para admitir el Diseñador. No se puede modificar
		/// el contenido de este método con el editor de código.
		/// </summary>
		void InitializeComponent(void)
		{
			this->components = (gcnew System::ComponentModel::Container());
			this->Timer = (gcnew System::Windows::Forms::Timer(this->components));
			this->SuspendLayout();
			// 
			// Timer
			// 
			this->Timer->Enabled = true;
			this->Timer->Interval = 80;
			this->Timer->Tick += gcnew System::EventHandler(this, &MyForm::Timer_Tick);
			// 
			// MyForm
			// 
			this->AutoScaleDimensions = System::Drawing::SizeF(8, 16);
			this->AutoScaleMode = System::Windows::Forms::AutoScaleMode::Font;
			this->ClientSize = System::Drawing::Size(692, 439);
			this->DoubleBuffered = true;
			this->Name = L"MyForm";
			this->Text = L"Juego";
			this->WindowState = System::Windows::Forms::FormWindowState::Maximized;
			this->Load += gcnew System::EventHandler(this, &MyForm::MyForm_Load);
			this->Paint += gcnew System::Windows::Forms::PaintEventHandler(this, &MyForm::MyForm_Paint);
			this->KeyDown += gcnew System::Windows::Forms::KeyEventHandler(this, &MyForm::MyForm_KeyDown);
			this->KeyUp += gcnew System::Windows::Forms::KeyEventHandler(this, &MyForm::MyForm_KeyUp);
			this->MouseClick += gcnew System::Windows::Forms::MouseEventHandler(this, &MyForm::MyForm_MouseClick);
			this->ResumeLayout(false);

		}
#pragma endregion
		void MyForm_Paint(System::Object^ sender, System::Windows::Forms::PaintEventArgs^ e) {
			Mundo^ mundoActual;
			Portal^ portalActual;
			val_mundo_2 = true;
			if (val_mundo_1) {
				portalActual = portal_1;
				mundoActual = mundo_1;
				imageWorldStartIndex = 0;
				imageWorldEndIndex = 0;
				imagePortalStartIndex = 0;
				imagePortalEndIndex = 0;
			}
			else if (val_mundo_2) {
				portalActual = portal_2;
				mundoActual = mundo_2;
				imageWorldStartIndex = 0;
				imageWorldEndIndex = 0;
				imagePortalStartIndex = 0;
				imagePortalEndIndex = 3;
			}
			else if (val_mundo_3) {
				portalActual = portal_3;
				mundoActual = mundo_3;
				imageWorldStartIndex = 0;
				imageWorldEndIndex = 1;
				imagePortalStartIndex = 0;
				imagePortalEndIndex = 3;
			}
			else if (val_mundo_4) {
				portalActual = portal_4;
				mundoActual = mundo_4;
				imageWorldStartIndex = 0;
				imageWorldEndIndex = 2;
			}
			else if (val_mundo_5) {
				portalActual = portal_5;
				mundoActual = mundo_5;
				imageWorldStartIndex = 0;
				imageWorldEndIndex = 4;
			}
			if (mundoActual != nullptr) {
				// Crear la matriz de colores para reducir la saturación del background
				System::Drawing::Imaging::ColorMatrix^ colorMatrix = gcnew System::Drawing::Imaging::ColorMatrix();
				colorMatrix->Matrix33 = 1.0f; // Nivel de transparencia

				System::Drawing::Imaging::ImageAttributes^ imageAttributes = gcnew System::Drawing::Imaging::ImageAttributes();
				imageAttributes->SetColorMatrix(colorMatrix, System::Drawing::Imaging::ColorMatrixFlag::Default, System::Drawing::Imaging::ColorAdjustType::Bitmap);

				// Ajustar el background al tamaño de la ventana
				System::Drawing::Rectangle destRect = System::Drawing::Rectangle(0, 0, this->ClientSize.Width, this->ClientSize.Height);
				e->Graphics->DrawImage(mundoActual->getImagenes()[imageWorldIndex], destRect, mundoActual->getX(), mundoActual->getY(), mundoActual->getImagenes()[imageWorldIndex]->Width, mundoActual->getImagenes()[imageWorldIndex]->Height, System::Drawing::GraphicsUnit::Pixel, imageAttributes);
				++imageWorldIndex;
				if (imageWorldIndex > imageWorldEndIndex) {
					imageWorldIndex = imageWorldStartIndex;
				}
				// Dibujar el portal
				if (portalActual != nullptr) {
					// Crear el rectángulo donde se dibujará el portal
					System::Drawing::Rectangle portalRect = System::Drawing::Rectangle(portalActual->getX(), portalActual->getY(), portalActual->getWidth(), portalActual->getHeight());

					// Dibujar la imagen del portal
					e->Graphics->DrawImage(portalActual->getImagen()[imagePortalIndex], portalRect);
				}
				++imagePortalIndex;
				if (imagePortalIndex > imagePortalEndIndex) {
					imagePortalIndex = imagePortalStartIndex;
				}
			}

			if (sprites != nullptr && sprites->Length > 0) {

				spriteWidth = 80;
				spriteHeight = 80;
				e->Graphics->DrawImage(sprites[spriteIndex], spriteX, spriteY, spriteWidth, spriteHeight); // Cambia (0, 0) por las coordenadas deseadas
			}
		}
		void Timer_Tick(System::Object^ sender, System::EventArgs^ e) {
			if (val_mundo_1) {
				suelosActuales = suelos_1;
			}
			else if (val_mundo_2) {
				suelosActuales = suelos_2;
			}
			else if (val_mundo_3){
				suelosActuales = suelos_3;
			}
			else if (val_mundo_4) {
				suelosActuales = suelos_4;
			}
			else if (val_mundo_5) {
				suelosActuales = suelos_5;
			}
			if (!falling) {
				for (int i = 0; i < suelosActuales->getN(); ++i) {
					Suelo^ sueloActual = suelosActuales->getSuelo(i);

					int sueloX = sueloActual->getX();
					int sueloY = sueloActual->getY();
					int sueloWidth = sueloActual->getWidth();
					int sueloHeight = sueloActual->getHeight();

					int pieSpriteY = spriteY + spriteHeight - margendeErrorY;

					if (pieSpriteY >= sueloY &&
						pieSpriteY <= sueloY + sueloHeight &&
						spriteX + spriteWidth >= sueloX + margendeErrorX &&
						spriteX <= sueloX + sueloWidth - margendeErrorX * 2) {
						falling = false;
						break;
					}
					else if (pieSpriteY > defaultFloorY + margendeErrorY * 2) {
						falling = false;
						break;
					}
					else {
						falling = true;
					}
				}
			}
			int movimiento = 10;
			Graphics^ g = this->CreateGraphics();
			// Actualiza la posición del sprite al moverse
			if (sliding) {
				if (lastMove == "right" || movingRight) {
					spriteX += slideSpeed;
					lastMove = "right";  // Guarda la última dirección
				}
				else if (lastMove == "left" || movingLeft) {
					spriteX -= slideSpeed;
					lastMove = "left";  // Guarda la última dirección
				}
				slideSpeed *= 0.95;
				if (spriteX < 0) {
					spriteX = 0;
				}
				else if (spriteX + spriteWidth > g->VisibleClipBounds.Width) {
					spriteX = g->VisibleClipBounds.Width - spriteWidth;
				}
			}
			if (running || jumping || falling) {
				if (movingRight) {
					spriteX += movimiento;
					lastMove = "right";  // Guarda la última dirección
				}
				else if (movingLeft) {
					spriteX -= movimiento;
					lastMove = "left";  // Guarda la última dirección
				}
				if (spriteX < 0) {
					spriteX = 0;
				}
				else if (spriteX + spriteWidth > g->VisibleClipBounds.Width) {
					spriteX = g->VisibleClipBounds.Width - spriteWidth;
				}
			}

			if (running) {
				if (movingRight) {
					startIndex = 4; // Primer sprite de movimiento a la derecha
					endIndex = 6;   // Último sprite de movimiento a la derecha
				}
				else if (movingLeft) {
					startIndex = 7; // Primer sprite de movimiento a la izquierda
					endIndex = 9;   // Último sprite de movimiento a la izquierda
				}
				else { // Si no se está moviendo
					if (lastMove == "right") {
						startIndex = 0; // Último sprite estático mirando a la derecha
						endIndex = 1;   // Mantener el mismo sprite
					}
					else if (lastMove == "left") {
						startIndex = 2; // Último sprite estático mirando a la izquierda
						endIndex = 3;   // Mantener el mismo sprite
					}
				}
				spriteIndex++;
				if (spriteIndex > endIndex) {
					spriteIndex = startIndex;
				}
				if (spriteX == 0) {
					spriteIndex = 31;
				}
				else if (spriteX + spriteWidth == g->VisibleClipBounds.Width) {
					spriteIndex = 30;
				}
			}

			if (jumping) {
				punching = false;
				shooting = false;
				running = false;
				if (jumpSpeed > 0) {
					// Mostrar el sprite inicial de salto
					if (jumpSpeed == jumpStrength) {
						if (lastMove == "right" || movingRight) {
							spriteIndex = 10;
						}
						else if (lastMove == "left" || movingLeft) {
							spriteIndex = 12;
						}
						jumpSpeed -= gravity;
					}
					else {
						// Mantener el sprite de estar en el aire
						if (lastMove == "right" || movingRight) {
							spriteIndex = 11;
						}
						else if (lastMove == "left" || movingLeft) {
							spriteIndex = 13;
						}
						spriteY -= jumpSpeed;
						jumpSpeed -= gravity;
					}

					if (spriteY < 22) {
						spriteY = 22;
						jumping = false;
						falling = true;
						jumpSpeed = 0;
					}
				}
				else {
					jumping = false;
					falling = true;
					jumpSpeed = 0;
				}
			}
			else if (falling) {
				punching = false;
				shooting = false;
				if (lastMove == "right" || movingRight) {
					spriteIndex = 14;
				}
				else if (lastMove == "left" || movingLeft) {
					spriteIndex = 16;
				}

				if (spriteX == 0) {
					spriteIndex = 33;
				}
				else if (spriteX + spriteWidth == g->VisibleClipBounds.Width) {
					spriteIndex = 32;
				}

				spriteY += gravity;
				gravity += aceleration;
				if (spriteY + spriteHeight > defaultFloorY + margendeErrorY * 3) {
					if (lastMove == "right" || movingRight) {
						spriteIndex = 15;
					}
					else if (lastMove == "left" || movingLeft) {
						spriteIndex = 17;
					}

					spriteY = defaultFloorY;
					falling = false;
					running = true;
					gravity = 5;
				}

				for (int i = 0; i < suelosActuales->getN(); ++i) {
					Suelo^ sueloActual = suelosActuales->getSuelo(i);

					int sueloX = sueloActual->getX();
					int sueloY = sueloActual->getY();
					int sueloWidth = sueloActual->getWidth();
					int sueloHeight = sueloActual->getHeight();

					int pieSpriteY = spriteY + spriteHeight - margendeErrorY;

					if (pieSpriteY >= sueloY &&
						pieSpriteY <= sueloY + sueloHeight &&
						spriteX + spriteWidth >= sueloX + margendeErrorX &&
						spriteX <= sueloX + sueloWidth - margendeErrorX * 2) {

						spriteY = sueloY - spriteHeight + margendeErrorY;
						falling = false;
						running = true;
						gravity = 5;
					}
				}
			}
			if (sliding) {
				lapse += 0.1;
				if (lastMove == "right" || movingRight) {
					spriteIndex = 28;
				}
				else if (lastMove == "left" || movingLeft) {
					spriteIndex = 29;
				}
				if (lapse > 1.5) {
					running = true;
					sliding = false;
					lapse = 0;
				}
			}

			if (punching) {
				running = false;
				if (!punchingStarted) {
					if (lastMove == "right") {
						startIndex = 18;
						endIndex = 21;
					}
					else if (lastMove == "left") {
						startIndex = 22;
						endIndex = 25;
					}
					spriteIndex = startIndex;
					punchingStarted = true;
				}
				else if(punchingStarted){
					spriteIndex++;
					if (spriteIndex > endIndex) {
						spriteIndex = startIndex;
					}
				}
			}

			if (shooting) {
				running = false;
				if (lastMove == "right") {
					spriteIndex = 26;
				}
				else if (lastMove == "left") {
					spriteIndex = 27;
				}
			}
			
			this->Invalidate();
		}

		void MyForm_KeyDown(System::Object^ sender, System::Windows::Forms::KeyEventArgs^ e) {
			if (punching || shooting) {
				return;
			}
			if (e->KeyCode == Keys::D) {
				if (!movingRight) {
					movingRight = true;
					movingLeft = false;
					spriteIndex = 4;
				}
			}
			else if (e->KeyCode == Keys::A) {
				if (!movingLeft) {
					movingLeft = true;
					movingRight = false;
					spriteIndex = 7;
				}
			}
			else if (e->KeyCode == Keys::Space && !jumping && !falling && !sliding) {
				running = false;
				jumping = true;
				initialY = spriteY;
				jumpSpeed = jumpStrength;
			}
			if (running) {
				if (e->KeyCode == Keys::R) {
					punching = false;
					shooting = false;
					running = false;
					jumping = false;
					sliding = true;
					slideSpeed = slideStrength;
				}
			}
			if (!running || !jumping || !falling || !sliding) {
				if (e->KeyCode == Keys::Q) {
					punching = true;
				}
				else if (e->KeyCode == Keys::E) {
					shooting = true;
				}
			}
		}

		void MyForm_KeyUp(System::Object^ sender, System::Windows::Forms::KeyEventArgs^ e) {
			if (e->KeyCode == Keys::D) {
				movingRight = false;
				lastMove = "right";
			}
			else if (e->KeyCode == Keys::A) {
				movingLeft = false;
				lastMove = "left";
			}
			else if (e->KeyCode == Keys::Q) {
				running = true;
				punching = false;
				punchingStarted = false;
			}
			else if (e->KeyCode == Keys::E) {
				running = true;
				shooting = false;
			}
			
		}
		void MyForm_Load(System::Object^ sender, System::EventArgs^ e) {
			
		}
		void MyForm_MouseClick(System::Object^ sender, System::Windows::Forms::MouseEventArgs^ e) {
			String^ x = e->X.ToString();
			String^ y = e->Y.ToString();
			MessageBox::Show("X: " + x + " Y: " + y);
		}
		void gifTimer_Tick(System::Object^ sender, System::EventArgs^ e) {
			Graphics^ g = this->CreateGraphics();
			this->Invalidate(System::Drawing::Rectangle(0, 0, g->VisibleClipBounds.Width, g->VisibleClipBounds.Height));
		}
};
}
