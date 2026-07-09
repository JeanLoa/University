#include <iostream>

using namespace std;

int main() {
    char verificacion;
    int lado1, lado2, lado3;

    cout << "Ingresa el lado 1: ";
    cin >> lado1;
    (lado1 <= 0) ? cout << "El lado ingresado no es valido ", exit(0) : (void)0;
    cout << "Ingresa el lado 2: ";
    cin >> lado2;
    (lado2 <= 0) ? cout << "El lado ingresado no es valido ", exit(0) : (void)0;
    cout << "Ingresa el lado 3: ";
    cin >> lado3;
    (lado1 <= 0) ? cout << "El lado ingresado no es valido ", exit(0) : (void)0;

    verificacion = (lado1 == lado2 && lado2 == lado3) ? 'V' : 'F';
    cout << "Equilatero: " << verificacion << endl;
    verificacion = (lado1 == lado2 || lado2 == lado3 || lado3 == lado1) ? 'V' : 'F';
    cout << "Isosceles: " << verificacion << endl;
    verificacion = (lado1 != lado2 && lado2 != lado3 && lado3 != lado1) ? 'V' : 'F';
    cout << "Escaleno: " << verificacion << endl;

    return 0;
}
