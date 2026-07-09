#pragma once
#include "iostream"
using namespace System::Drawing;

int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}

int randD() {
	return randnum(1, 5);
}

class Cuadrado {
private:
	int x, y, dx, lado;
public:
	Cuadrado(int x, int y, int dx, int l) : x(x), y(y), dx(dx), lado(l){}
	~Cuadrado(){}
	void dibujar(Graphics^ g) {
		g->DrawRectangle(Pens::Blue, x, y, lado, lado);
	}
	void borrar(Graphics^ g) {
		g->FillRectangle(Brushes::White, x - 1, y - 1, lado + 2, lado + 2);
	}
	void mover() {
		x += dx;
	}
	int getLado() {
		return this->lado;
	}
	int getX() {
		return this->x;
	}
};
class Triangulo {
private:
	int x, y, dx;
public:
	Triangulo(int x, int y, int dx) : x(x), y(y), dx(dx){}
	~Triangulo(){}
	void dibujar(Graphics^ g) {
		array<Point>^ points = gcnew array<Point>{
			Point(x, y + 25),
			Point(x + 25, y),
			Point(x + 50, y + 25)
		};
		g->DrawPolygon(Pens::Blue, points);
	}
	void borrar(Graphics^ g) {
		array<Point>^ points = gcnew array<Point>{
			Point(x - 2, y + 27),
			Point(x + 25, y - 1),
			Point(x + 52, y + 27)
		};
		g->FillPolygon(Brushes::White, points);
	}
	void mover() {
		x += dx;
	}
	int getX() {
		return this->x;
	}
	int getPunto() {
		return 50;
	}
};

class Circulo {
private:
	int x, y, dx, radio;
public:
	Circulo(int x, int y, int dx, int radio) : x(x), y(y), dx(dx), radio(radio){}
	~Circulo(){}
	void dibujar(Graphics^ g) {
		g->DrawEllipse(Pens::Red, x, y, radio, radio);
	}
	void borrar(Graphics^ g) {
		g->FillEllipse(Brushes::White, x - 1, y - 1, radio + 2, radio + 2);
	}
	void mover() {
		x += dx;
	}
	int getX() {
		return this->x;
	}
	int getRadio() {
		return this->radio;
	}
};

class Carrera {
private:
	Cuadrado* ObjCuadrado;
	Triangulo* ObjTriangulo;
	Circulo* ObjCirculo;
public:
	Carrera() {
		ObjCuadrado = new Cuadrado(1, 50, randD(), 20);
		ObjTriangulo = new Triangulo(1, 200, randD());
		ObjCirculo = new Circulo(1, 350, randD(), 15);
	}
	~Carrera() {
		delete ObjCuadrado;
		delete ObjCirculo;
		delete ObjTriangulo;
	}
	int iniciarCarrera(Graphics^ g) {
		ObjCuadrado->borrar(g);
		ObjCuadrado->mover();
		ObjCuadrado->dibujar(g);
		
		ObjTriangulo->borrar(g);
		ObjTriangulo->mover();
		ObjTriangulo->dibujar(g);

		ObjCirculo->borrar(g);
		ObjCirculo->mover();
		ObjCirculo->dibujar(g);

		if (ObjCuadrado->getX() + ObjCuadrado->getLado() > 1000) {
			return 1;
		}
		else if (ObjTriangulo->getX() + ObjTriangulo->getPunto() > 1000) {
			return 2;
		}
		else if (ObjCirculo->getX() + ObjCirculo->getRadio() > 1000) {
			return 3;
		}
	}
};
