#!/bin/sh -e

sudo apt-get update
sudo apt-get -yV install gsl-bin
sudo apt-get -yV install libgsl0-dbg
sudo apt-get -yV install libgsl0-dev
sudo apt-get -yV install libgsl23
sudo apt-get -yV install libgslcblas0
exit 0