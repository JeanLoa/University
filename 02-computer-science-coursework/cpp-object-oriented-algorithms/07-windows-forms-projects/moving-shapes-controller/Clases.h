#pragma once
#include "iostream"
#include "MyForm.h"
using namespace System::Windows::Forms;
using namespace System::Drawing;
int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}
int randX() {
	return randnum(2, 750);
}
int randY() {
	return randnum(2, 520);
}
class Figura {
protected:
	int x, y;
	int medida;
	int color;
	int d;
	bool visible;
public:
	Figura(int x, int y, int diametro, int color, int d, bool visible) : x(x), y(y), medida(diametro), color(color), d(d), visible(visible) {}
	~Figura() {}
	virtual void dibujar(Graphics^ g) = 0;
	virtual void mover() = 0;
	int GetX() {
		return this->x;
	}
	int GetY() {
		return this->y;
	}
	int GetDiametro() {
		return this->medida;
	}
	void setVisible(bool visible) {
		this->visible = visible;
	}
	bool isVisible() {
		return this->visible;
	}
};
class Circulo : public Figura {
public:
	Circulo(int x, int y, int diametro, int color, int dx, bool visible) : Figura(x, y ,diametro, color, dx, visible){}
	~Circulo(){}
	void dibujar(Graphics^ g) override {
		g->DrawEllipse(Pens::Black, x, y, medida, medida);
	}
	void mover() override {
		if (x >= 750 || x <= 0) d *= -1;
		x += d;
	}
	int GetX() {
		return this->x;
	}
	int GetY() {
		return this->y;
	}
	int GetDiametro() {
		return this->medida;
	}
	void setVisible(bool visible) {
		this->visible = visible;
	}
	bool isVisible() {
		return this->visible;
	}
};

class Triangulo : public Figura {
public:
	Triangulo(int x, int y, int lado, int color, int dy, bool visible) : Figura(x, y, lado, color, dy, visible){}
	~Triangulo(){}
	void dibujar(Graphics^ g) override {
		array<Point>^ puntos = {
	Point(x, y),
	Point(x + medida / 2, y + medida),
	Point(x - medida / 2, y + medida)
		};
		g->DrawPolygon(Pens::Black, puntos);
	}
	void mover() override {
		if (y <= 0 || y >= 500) d *= -1;
		y += d;
	}
	int GetX() {
		return this->x;
	}
	int GetY() {
		return this->y;
	}
	int GetLado() {
		return this->medida;
	}
	void setVisible(bool visible) {
		this->visible = visible;
	}
	bool isVisible() {
		return this->visible;
	}
};

class Controlador {
private:
	Circulo** circulos;
	int n_Circulos;
	Triangulo** triangulos;
	int n_Triangulos;
public:
	Controlador() : circulos(nullptr), n_Circulos(0), triangulos(nullptr), n_Triangulos(0){}
	~Controlador(){}
	void dibujarFiguras(Graphics^ g) {
		for (int i = 0; i < n_Circulos; ++i) {
			circulos[i]->dibujar(g);
			circulos[i]->mover();
		}
		for (int i = 0; i < n_Triangulos; ++i) {
			triangulos[i]->dibujar(g);
			triangulos[i]->mover();
		}
	}
	void agregarCirculo() {
		Circulo** nuevoCirculo = new Circulo * [n_Circulos + 1];
		for (int i = 0; i < n_Circulos; i++) {
			nuevoCirculo[i] = circulos[i];
		}
		nuevoCirculo[n_Circulos] = new Circulo(1, randY(), 30, 0, 5, true);
		if (circulos != nullptr) delete[] circulos;
		circulos = nuevoCirculo;
		n_Circulos++;
	}
	void agregarTriangulo() {
		Triangulo** nuevoTriangulo = new Triangulo * [n_Triangulos + 1];
		for (int i = 0; i < n_Triangulos; i++) {
			nuevoTriangulo[i] = triangulos[i];
		}
		nuevoTriangulo[n_Triangulos] = new Triangulo(randX(), 1, 30, 0, 5, true);
		if (triangulos != nullptr) delete[] triangulos;
		triangulos = nuevoTriangulo;
		n_Triangulos++;
	}
	void eliminarCirculo(int indice) {
		if (n_Circulos > 0) {
			delete circulos[indice];
			Circulo** copia = new Circulo * [n_Circulos - 1];
			for (int i = indice; i < n_Circulos - 1; ++i) {
				circulos[i] = circulos[i + 1];
			}
			for (int i = 0; i < n_Circulos - 1; ++i) {
				copia[i] = circulos[i];
			}
			delete[] circulos;
			circulos = copia;
			--n_Circulos;
		}
	}
	void eliminarTriangulo(int indice) {
		if (n_Triangulos > 0) {
			delete triangulos[indice];
			Triangulo** copia = new Triangulo * [n_Triangulos - 1];
			for (int i = indice; i < n_Triangulos - 1; ++i) {
				triangulos[i] = triangulos[i + 1];
			}
			for (int i = 0; i < n_Triangulos - 1; ++i) {
				copia[i] = triangulos[i];
			}
			delete[] triangulos;
			triangulos = copia;
			--n_Triangulos;
		}
	}
	void colision() {
		for (int i = 0; i < n_Circulos; ++i) {
			for (int j = 0; j < n_Triangulos; ++j) {

				int cX = circulos[i]->GetX();
				int cY = circulos[i]->GetY();
				int tX = triangulos[j]->GetX();
				int tY = triangulos[j]->GetY();
				int diametro = circulos[i]->GetDiametro();
				int lado = triangulos[j]->GetLado();

				if ((cX < tX + lado && cX + diametro > tX) &&
					(cY < tY + lado && cY + diametro > tY)) {

					eliminarCirculo(i);
					eliminarTriangulo(j);

					--i;
					--j;
					break;
				}
			}
		}
	}
};
