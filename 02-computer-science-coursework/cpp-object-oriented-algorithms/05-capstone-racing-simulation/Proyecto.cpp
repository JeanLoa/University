#include <iostream>
#include "pch.h"
#include "Carrera.h"
using namespace std;
using namespace System;
int main() {
    srand(time(nullptr));
    Console::CursorVisible = false;
    Carrera* ObjCarrera;
    ObjCarrera = new Carrera;
    ObjCarrera->IniciaCarrera();

    return 0;
}