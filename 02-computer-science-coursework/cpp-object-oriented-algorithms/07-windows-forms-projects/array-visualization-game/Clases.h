#pragma once
#include "array"
using namespace System::Windows::Forms;
using namespace System::Drawing;

int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}

int randX() {
	return randnum(1, 1200);
}
int randY() {
	return randnum(1, 400);
}
int randD() {
	int num = randnum(1, 2) == 1 ? 1 : -1;
	return randnum(1, 5) * num;
}
Pen^ randColor() {
	int num = randnum(1, 14);
	switch (num) {
	case 1:
		return Pens::Blue;
	case 2:
		return Pens::Red;
	case 3:
		return Pens::Green;
	case 4:
		return Pens::Yellow;
	case 5:
		return Pens::Black;
	case 6:
		return Pens::DarkBlue;
	case 7:
		return Pens::Purple;
	case 8:
		return Pens::Orange;
	case 9:
		return Pens::Brown;
	case 10:
		return Pens::Violet;
	case 11:
		return Pens::Pink;
	case 12:
		return Pens::Cyan;
	case 13:
		return Pens::Magenta;
	case 14:
		return Pens::Gray;
	default:
		return Pens::Black;
	}
}

public ref class Triangulo {
private:
	int x, y, dx, dy;
	Pen^ pen;
public:
	Triangulo(int x, int y, int dx, int dy) : x(x), y(y), dx(randD()), dy(randD()), pen(randColor()) {}
	~Triangulo(){}
	void dibujar(Graphics^ g) {
		array<Point>^ points = gcnew array <Point> {
			Point(x, y + 25),
			Point(x + 20, y),
			Point(x + 40, y + 25)
		};
		g->DrawPolygon(pen, points);
	}
	void borrar(Graphics^ g) {
		array<Point>^ points = gcnew array <Point> {
			Point(x - 2, y + 27),
			Point(x + 20, y - 2),
			Point(x + 42, y + 27)
		};
		g->FillPolygon(Brushes::White, points);
	}
	void mover(Graphics^ g) {
		if (x < 0 || x + 40 > g->VisibleClipBounds.Width) dx *= -1;
		if (y < 0 || y + 25 > g->VisibleClipBounds.Height) dy *= -1;
		x += dx;
		y += dy;
	}
};

public ref class Circulo {
private:
	int x, y, dx, dy;
	int radio;
	Pen^ pen;
public:
	Circulo(int x, int y, int dx, int dy, int radio) : x(x), y(y), dx(randD()), dy(randD()), radio(radio), pen(randColor()){}
	~Circulo() {}
	void dibujar(Graphics^ g) {
		g->DrawEllipse(pen, x, y, radio, radio);
	}
	void borrar(Graphics^ g) {
		g->FillEllipse(Brushes::White, x - 1, y - 1, radio + 2, radio + 2);
	}
	void mover(Graphics^ g) {
		if (x < 0 || x + radio > g->VisibleClipBounds.Width) dx *= -1;
		if (y < 0 || y + radio > g->VisibleClipBounds.Height) dy *= -1;
		x += dx;
		y += dy;
	}
};

public ref class Elipse {
private:
	int x, y, dx, dy;
	int ejeMa, ejeMe;
	Pen^ pen;
public:
	Elipse(int x, int y, int dx, int dy, int eMa, int eMe) : x(x), y(y), dx(randD()), dy(randD()), ejeMa(eMa), ejeMe(eMe), pen(randColor()) {}
	~Elipse() {}
	void dibujar(Graphics^ g) {
		g->DrawEllipse(pen, x, y, ejeMa, ejeMe);
	}
	void borrar(Graphics^ g) {
		g->FillEllipse(Brushes::White, x - 1, y - 1, ejeMa + 2, ejeMe + 2);
	}
	void mover(Graphics^ g) {
		if (x < 0 || x + ejeMa > g->VisibleClipBounds.Width) dx *= -1;
		if (y < 0 || y + ejeMe > g->VisibleClipBounds.Height) dy *= -1;
		x += dx;
		y += dy;
	}
};

public ref class Cuadrado {
private:
	int x, y, dx, dy;
	int lado;
	Pen^ pen;
public:
	Cuadrado(int x, int y, int dx, int dy, int l) : x(x), y(y), dx(randD()), dy(randD()), lado(l), pen(randColor()) {}
	~Cuadrado() {}
	void dibujar(Graphics^ g) {
		g->DrawRectangle(pen, x, y, lado, lado);
	}
	void borrar(Graphics^ g) {
		g->FillRectangle(Brushes::White, x - 1, y - 1, lado + 2, lado + 2);
	}
	void mover(Graphics^ g) {
		if (x < 0 || x + lado > g->VisibleClipBounds.Width) dx *= -1;
		if (y < 0 || y + lado > g->VisibleClipBounds.Height) dy *= -1;
		x += dx;
		y += dy;
	}
};

public ref class Rectangulo {
private:
	int x, y, dx, dy;
	int ancho, largo;
	Pen^ pen;
public:
	Rectangulo(int x, int y, int dx, int dy, int a, int l) : x(x), y(y), dx(randD()), dy(randD()), ancho(a), largo(l), pen(randColor()) {}
	~Rectangulo() {}
	void dibujar(Graphics^ g) {
		g->DrawRectangle(pen, x, y, ancho, largo);
	}
	void borrar(Graphics^ g) {
		g->FillRectangle(Brushes::White, x - 1, y - 1, ancho + 2, largo + 2);
	}
	void mover(Graphics^ g) {
		if (x < 0 || x + ancho > g->VisibleClipBounds.Width) dx *= -1;
		if (y < 0 || y + largo > g->VisibleClipBounds.Height) dy *= -1;
		x += dx;
		y += dy;
	}
};

public ref class Arreglo {
private:
	array<Triangulo^>^ triangulos;
	int n_Triangulos;
	array<Circulo^>^ circulos;
	int n_Circulos;
	array<Elipse^>^ elipses;
	int n_Elipses;
	array<Cuadrado^>^ cuadrados;
	int n_Cuadrados;
	array<Rectangulo^>^ rectangulos;
	int n_Rectangulos;
public:
	Arreglo() : n_Triangulos(0), triangulos(nullptr), n_Circulos(0), circulos(nullptr), n_Elipses(0), elipses(nullptr), n_Cuadrados(0), cuadrados(nullptr), n_Rectangulos(0), rectangulos(nullptr){}
	~Arreglo() {
		delete[] triangulos;
		delete[] circulos;
		delete[] elipses;
		delete[] cuadrados;
		delete[] rectangulos;
	}
	void dibujarFiguras(Graphics^ g) {
		for (int i = 0; i < n_Triangulos; ++i) {
			triangulos[i]->borrar(g);
			triangulos[i]->mover(g);
			triangulos[i]->dibujar(g);
		}
		for (int i = 0; i < n_Circulos; ++i) {
			circulos[i]->borrar(g);
			circulos[i]->mover(g);
			circulos[i]->dibujar(g);
		}
		for (int i = 0; i < n_Elipses; ++i) {
			elipses[i]->borrar(g);
			elipses[i]->mover(g);
			elipses[i]->dibujar(g);
		}
		for (int i = 0; i < n_Cuadrados; ++i) {
			cuadrados[i]->borrar(g);
			cuadrados[i]->mover(g);
			cuadrados[i]->dibujar(g);
		}
		for (int i = 0; i < n_Rectangulos; ++i) {
			rectangulos[i]->borrar(g);
			rectangulos[i]->mover(g);
			rectangulos[i]->dibujar(g);
		}
	}
	void agregarFiguras(KeyEventArgs^ e) {
		if (e->KeyCode == Keys::T) {
			agregarTriangulo();
		}
		else if (e->KeyCode == Keys::C) {
			agregarCirculo();
		}
		else if (e->KeyCode == Keys::E) {
			agregarElipse();
		}
		else if (e->KeyCode == Keys::D) {
			agregarCuadrado();
		}
		else if (e->KeyCode == Keys::R) {
			agregarRectangulo();
		}
	}
private:
	void agregarTriangulo() {
		array<Triangulo^>^ copia = gcnew array<Triangulo^>(n_Triangulos + 1);
		for (int i = 0; i < n_Triangulos; ++i) {
			copia[i] = triangulos[i];
		}
		copia[n_Triangulos] = gcnew Triangulo(randX(), randY(), randD(), randD());
		delete[] triangulos;
		triangulos = copia;
		++n_Triangulos;
	}
	void agregarCirculo() {
		array<Circulo^>^ copia = gcnew array<Circulo^>(n_Circulos + 1);
		for (int i = 0; i < n_Circulos; ++i) {
			copia[i] = circulos[i];
		}
		copia[n_Circulos] = gcnew Circulo(randX(), randY(), randD(), randD(), 20);
		delete[] circulos;
		circulos = copia;
		++n_Circulos;
	}
	void agregarElipse() {
		array<Elipse^>^ copia = gcnew array<Elipse^>(n_Elipses + 1);
		for (int i = 0; i < n_Elipses; ++i) {
			copia[i] = elipses[i];
		}
		copia[n_Elipses] = gcnew Elipse(randX(), randY(), randD(), randD(), 15, 30);
		delete[] elipses;
		elipses = copia;
		++n_Elipses;
	}
	void agregarCuadrado() {
		array<Cuadrado^>^ copia = gcnew array<Cuadrado^>(n_Cuadrados + 1);
		for (int i = 0; i < n_Cuadrados; ++i) {
			copia[i] = cuadrados[i];
		}
		copia[n_Cuadrados] = gcnew Cuadrado(randX(), randY(), randD(), randD(), 25);
		delete[] cuadrados;
		cuadrados = copia;
		++n_Cuadrados;
	}
	void agregarRectangulo() {
		array<Rectangulo^>^ copia = gcnew array<Rectangulo^>(n_Rectangulos + 1);
		for (int i = 0; i < n_Rectangulos; ++i) {
			copia[i] = rectangulos[i];
		}
		copia[n_Rectangulos] = gcnew Rectangulo(randX(), randY(), randD(), randD(), 20, 40);
		delete[] rectangulos;
		rectangulos = copia;
		++n_Rectangulos;
	}
};
