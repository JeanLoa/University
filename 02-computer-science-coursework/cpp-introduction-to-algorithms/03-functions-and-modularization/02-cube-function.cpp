#include <iostream>

using namespace std;

float Cubo(float A) {
    return pow(A, 3);
}

int main() {
    float Num;
    cout << "Ingrese un numero real: ";
    cin >> Num;
    float NumCubo = Cubo(Num);
    cout << "El cubo del numero ingresado es: " << NumCubo;

    return 0;
}
