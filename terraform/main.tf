resource "aws_vpc" "main" {
   cidr_block = "10.0.0.0/16"
} 

resource "aws_subnet" "subnet1" {
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.0.0/24"
  availability_zone = var.availability_zone
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "rt" {
  vpc_id = aws_vpc.main.id

  route {
   cidr_block = "0.0.0.0/0"
   gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "rta" {
  subnet_id = aws_subnet.subnet1.id
  route_table_id = aws_route_table.rt.id
}

resource "aws_security_group" "webSg" {
  name = "web"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "HTTP from VPC"
    from_port = var.app_port
    to_port = var.app_port
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

   tags = {
    Name = "Web-sg"
    }
}

resource "aws_s3_bucket" "s3Bucket" {
  bucket = var.bucket_name
}

resource "aws_instance" "web" {
  ami = var.ami
  instance_type = var.instance_type
  subnet_id = aws_subnet.subnet1.id
  vpc_security_group_ids = [aws_security_group.webSg.id]
  associate_public_ip_address = true

   tags = { 
    Name = "ecs-host" 
    }
}

resource "aws_ecr_repository" "web" {
  name =  var.name
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

output "repository_url" {
    value = aws_ecr_repository.web.repository_url
  }
