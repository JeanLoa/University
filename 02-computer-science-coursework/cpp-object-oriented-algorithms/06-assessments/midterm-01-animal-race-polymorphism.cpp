#include "pch.h"
#include <iostream>
#include <conio.h>
#include <windows.h>

using namespace System;
using namespace std;

class Animal {
public:
    virtual double calcularVelocidad() = 0;
    virtual double calcularFuerza() = 0;
};

class Conejo : public Animal {
private:
    double velocidad;
    double tamano;
public:
    Conejo(double v, double tamano) : velocidad(v), tamano(tamano){}
    ~Conejo(){}
    double calcularVelocidad() override {
        return velocidad;
    }
    double calcularFuerza() override {
        return tamano * 3;
    }
};

class Tortuga : public Animal {
private:
    double velocidad;
    double tamano;
public:
    Tortuga(double v, double tamano) : velocidad(v), tamano(tamano) {}
    ~Tortuga() {}
    double calcularVelocidad() override {
        return velocidad;
    }
    double calcularFuerza() override {
        return tamano * 3;
    }
};

class Perro : public Animal {
private:
    string raza;
    double tamano;
public:
    Perro(string r, double tamano) : raza(r), tamano(tamano) {}
    ~Perro(){}
    double calcularVelocidad() override {
        return tamano * 2;
    }
    double calcularFuerza() override {
        return tamano * 3;
    }
};

class Gato : public Animal {
private:
    double peso;
    double tamano;
public:
    Gato(double p, double tamano) : peso(p), tamano(tamano) {}
    ~Gato() {}
    double calcularVelocidad() override {
        return tamano * 2;
    }
    double calcularFuerza() override { return 0; }
    double calcularAgilidad() {
        return peso * tamano;
    }
};

class Caballo : public Animal {
private:
    double altura;
    double peso;
public:
    Caballo(double a, double peso) : altura(a), peso(peso) {}
    ~Caballo() {}
    double calcularFuerza() override {
        return altura * 3;
    }
    double calcularVelocidad() override {
        return altura * 2;
    }
};

class Pajaro : public Animal {
private:
    double velocidad;
    double tamano;
public:
    Pajaro(double v, double tamano) : velocidad(v), tamano(tamano) {}
    ~Pajaro() {}
    double calcularVelocidad() override {
        return tamano * 2;
    }
    double calcularFuerza() override { return 0; }
};

int main() {
    Console::CursorVisible = false;
    int opcion;

    string raza;
    double tamano;
    double velocidad;
    double peso;
    double altura;
    bool Salir = false;

    Conejo* conejo;
    Tortuga* tortuga;
    Perro* perro;
    Gato* gato;
    Caballo* caballo;
    Pajaro* pajaro;


    while (true) {
        Salir = false;
        system("cls");
        cout << "Ingrese que animal desea crear: ";
        cout << "\n1. Conejo";
        cout << "\n2. Tortuga";
        cout << "\n3. Perro";
        cout << "\n4. Gato";
        cout << "\n5. Caballo";
        cout << "\n6. Pajaro";
        cout << "\n7. Mostrar atributos";
        cout << "\n8. Salir";
        cout << endl;
        cin >> opcion;
        system("cls");
        switch (opcion) {
        case 1:
            cout << "Ingrese la velocidad: ";
            cin >> velocidad;
            cout << "Ingrese el tamano: ";
            cin >> tamano;
            conejo = new Conejo(velocidad, tamano);
            break;
        case 2:
            cout << "Ingrese la velocidad: ";
            cin >> velocidad;
            cout << "Ingrese el tamano: ";
            cin >> tamano;
            tortuga = new Tortuga(velocidad, tamano);
            break;
        case 3:
            cout << "Ingrese la raza: ";
            cin >> raza;
            cout << "Ingrese el tamano: ";
            cin >> tamano;
            perro = new Perro(raza, tamano);
            break;
        case 4:
            cout << "Ingrese la peso: ";
            cin >> peso;
            cout << "Ingrese el tamano: ";
            cin >> tamano;
            gato = new Gato(peso, tamano);
            break;
        case 5:
            cout << "Ingrese la altura: ";
            cin >> altura;
            cout << "Ingrese el peso: ";
            cin >> peso;
            caballo = new Caballo(peso, tamano);
            break;
        case 6:
            cout << "Ingrese la velocidad: ";
            cin >> velocidad;
            cout << "Ingrese el tamano: ";
            cin >> tamano;
            pajaro = new Pajaro(velocidad, tamano);
            break;

        case 7:
            while (!Salir) {
                system("cls");
                cout << "1. Conejo";
                cout << "\n2. Tortuga";
                cout << "\n3. Perro";
                cout << "\n4. Gato";
                cout << "\n5. Caballo";
                cout << "\n6. Pajaro";
                cout << "\n7. Salir";
                cout << endl;
                cin >> opcion;
                system("cls");
                switch (opcion) {
                case 1:
                    cout << "\n1. Mostrar velocidad";
                    cout << "\n2. Mostrar fuerza";
                    cout << endl;
                    cin >> opcion;
                    if (opcion == 1) {
                        cout << conejo->calcularVelocidad();
                    }
                    else if (opcion == 2) {
                        cout << conejo->calcularFuerza();
                    }
                    break;
                case 2:
                    cout << "\n1. Mostrar velocidad";
                    cout << "\n2. Mostrar fuerza";
                    cout << endl;
                    cin >> opcion;
                    if (opcion == 1) {
                        cout << tortuga->calcularVelocidad();
                    }
                    else if (opcion == 2) {
                        cout << tortuga->calcularFuerza();
                    }
                    break;
                case 3:
                    cout << "\n1. Mostrar velocidad";
                    cout << "\n2. Mostrar fuerza";
                    cout << endl;
                    cin >> opcion;
                    if (opcion == 1) {
                        cout << perro->calcularVelocidad();
                    }
                    else if (opcion == 2) {
                        cout << perro->calcularFuerza();
                    }
                    break;
                case 4:
                    cout << "\n1. Mostrar velocidad";
                    cout << "\n2. Mostrar agilidad";
                    cout << endl;
                    cin >> opcion;
                    if (opcion == 1) {
                        cout << gato->calcularVelocidad();
                    }
                    else if (opcion == 2) {
                        cout << gato->calcularAgilidad();
                    }
                    break;
                case 5:
                    cout << "\n1. Mostrar velocidad";
                    cout << "\n2. Mostrar fuerza";
                    cout << endl;
                    cin >> opcion;
                    if (opcion == 1) {
                        cout << caballo->calcularVelocidad();
                    }
                    else if (opcion == 2) {
                        cout << caballo->calcularFuerza();
                    }
                    break;
                case 6:
                    cout << "\n1. Mostrar velocidad";
                    cout << endl;
                    cin >> opcion;
                    if (opcion == 1) {
                        cout << pajaro->calcularVelocidad();
                    }
                    break;
                case 7:
                    Salir = true;
                    break;
                }
                system("pause>0");
            }
            break;
        case 8:
            cout << "Saliendo...";
            return 0;
            break;
        }
        system("pause>0");
    }
}
