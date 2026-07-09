#include <iostream>
#include <string>
#include <cmath>
#include <cctype>

using namespace std;

int randnum(int min, int max) {
    return min + rand() % (max - min + 1);
}

class Persona {
private:
    string nombre;
    int edad;
    string DNI;
    char sexo;
    int peso;
    int altura; // en centímetros
    const char SEXO_POR_DEFECTO = 'H';

public:
    Persona() : nombre(""), edad(0), sexo(SEXO_POR_DEFECTO), peso(0), altura(0) {
        generaDNI();
    }

    Persona(string nombre, int edad, char sexo) : nombre(nombre), edad(edad), sexo(sexo), peso(0), altura(0) {
        generaDNI();
    }

    Persona(string nombre, int edad, char sexo, int peso, int altura) : nombre(nombre), edad(edad), sexo(sexo), peso(peso), altura(altura) {
        generaDNI();
    }

    void setNombre(string nombre) {
        this->nombre = nombre;
    }

    void setEdad(int edad) {
        this->edad = edad;
    }

    void setSexo(char sexo) {
        this->sexo = sexo;
    }

    void setPeso(int peso) {
        this->peso = peso;
    }

    void setAltura(int altura) {
        this->altura = altura;
    }

    string getNombre() {
        return this->nombre;
    }

    int getEdad() {
        return this->edad;
    }

    char getSexo() {
        return this->sexo;
    }

    int getPeso() {
        return this->peso;
    }

    int getAltura() {
        return this->altura;
    }

    int IMC() {
        float altura_metros = this->altura / 100.0;
        float imc = this->peso / (altura_metros * altura_metros);
        int Indice;
        if (imc < 20) {
            Indice = -1;
            cout << "\nSu IMC: " << Indice << " indica que está debajo de su peso ideal";
        }
        else if (imc >= 20 && imc <= 25) {
            Indice = 0;
            cout << "\nSu IMC: " << Indice << " indica que está en su peso ideal";
        }
        else {
            Indice = 1;
            cout << "\nSu IMC: " << Indice << " indica que tiene sobrepeso";
        }
        return Indice;
    }

    bool esMayorDeEdad() {
        bool mayorDeEdad = this->edad >= 18;
        if (mayorDeEdad) {
            cout << "\nEs mayor de edad";
        }
        else {
            cout << "\nEs menor de edad";
        }
        return mayorDeEdad;
    }

    void comprobarSexo(char sexo) {
        sexo = toupper(sexo);
        if (sexo != 'H' && sexo != 'M') {
            this->sexo = SEXO_POR_DEFECTO;
        }
        else {
            this->sexo = sexo;
        }
    }

    void toString() {
        cout << "\n\nNombre: " << this->nombre;
        cout << "\nEdad: " << this->edad;
        cout << "\nDNI: " << this->DNI;
        cout << "\nSexo: " << this->sexo;
        cout << "\nPeso: " << this->peso;
        cout << "\nAltura: " << this->altura;
    }

    void generaDNI() {
        DNI = "";
        for (int i = 0; i < 8; ++i) {
            DNI += '0' + randnum(0, 9);
        }
    }
};

int main() {
    srand(time(0));

    string nombre;
    int edad;
    char sexo;
    int peso;
    int altura;

    cout << "Ingrese el nombre: ";
    cin >> nombre;
    cout << "Ingrese la edad: ";
    cin >> edad;
    cout << "Ingrese el sexo('H' o 'M'): ";
    cin >> sexo;
    cout << "Ingrese el peso: ";
    cin >> peso;
    cout << "Ingrese la altura en cm: ";
    cin >> altura;

    Persona p1(nombre, edad, sexo, peso, altura);
    Persona p2(nombre, edad, sexo);
    Persona p3;

    p3.setNombre("Jean");
    p3.setEdad(19);
    p3.setSexo('H');
    p3.setPeso(75);
    p3.setAltura(175);

    p1.esMayorDeEdad();
    p2.esMayorDeEdad();
    p3.esMayorDeEdad();

    p1.IMC();
    p2.IMC();
    p3.IMC();

    p1.toString();
    p2.toString();
    p3.toString();

    return 0;
}
