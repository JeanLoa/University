#pragma once
#include "iostream"
using namespace std;
using namespace System;
using namespace System::Drawing;

class Circulo {
private:
    double radio;
    const int pi = 3.1416;
public:
    Circulo(double r) : radio(r) {}
    ~Circulo() {}
    double Area() {
        return pi * radio * radio;
    }
    void dibujar(Graphics^ g, int x, int y) {
        g->DrawEllipse(Pens::Red, x, y, radio * 2, radio * 2);
    }
};

class ArrayCirculos {
private:
    Circulo** circulos;
    int n;
public:
    ArrayCirculos() : circulos(nullptr), n(0) {}
    ~ArrayCirculos() {
        for (int i = 0; i < n; ++i) {
            delete circulos[i];
        }
        delete[] circulos;
    }
    void agregarCirculo(Circulo* nuevo) {
        Circulo** copia = new Circulo * [n + 1];
        for (int i = 0; i < n; ++i) {
            copia[i] = circulos[i];
        }
        copia[n] = nuevo;
        delete[] circulos;
        circulos = copia;
        ++n;
    }
    Circulo* getCirculo(int indice) {
        return circulos[indice];
    }
};

class Rectangulo {
private:
    double lado1, lado2;
public:
    Rectangulo(double l1, double l2) : lado1(l1), lado2(l2) {}
    ~Rectangulo() {}
    double Area() {
        return lado1 * lado2;
    }
    void dibujarRectangulo(Graphics^ g, int x, int y) {
        g->DrawRectangle(Pens::Red, x, y, lado1, lado2);
    }
};

class ArrayRectangulos {
private:
    Rectangulo** rectangulos;
    int n;
public:
    ArrayRectangulos() : rectangulos(nullptr), n(0) {}
    ~ArrayRectangulos() {
        for (int i = 0; i < n; ++i) {
            delete rectangulos[i];
        }
        delete[] rectangulos;
    }
    void agregarRectangulo(Rectangulo* nuevo) {
        Rectangulo** copia = new Rectangulo * [n + 1];
        for (int i = 0; i < n; ++i) {
            copia[i] = rectangulos[i];
        }
        copia[n] = nuevo;
        delete[] rectangulos;
        rectangulos = copia;
        ++n;
    }
    Rectangulo* getRectangulo(int indice) {
        return rectangulos[indice];
    }
};
