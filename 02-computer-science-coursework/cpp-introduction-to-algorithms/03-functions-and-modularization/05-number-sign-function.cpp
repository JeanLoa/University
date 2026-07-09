#include <iostream>

using namespace std;

int Funcion(float A) {
    int n;
    (A > 0) ? n = 1 : (A < 0) ? n = -1 : n = 0;
    return n;
}

int main() {
    int n;
    cout << "Ingrese un numero: ";
    cin >> n;
    int Verificacion = Funcion(n);
    cout << Verificacion;

    return 0;
}
