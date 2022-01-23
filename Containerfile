FROM fedora:34

WORKDIR /data

# Pre-requisites
RUN curl -LO https://repo.mongodb.org/yum/redhat/8Server/mongodb-org/5.0/x86_64/RPMS/mongodb-org-shell-5.0.3-1.el8.x86_64.rpm \
    && curl -LO https://repo.mongodb.org/yum/redhat/8Server/mongodb-org/5.0/x86_64/RPMS/mongodb-org-server-5.0.3-1.el8.x86_64.rpm \
    && curl -LO https://repo.mongodb.org/yum/redhat/8Server/mongodb-org/5.0/x86_64/RPMS/mongodb-mongosh-1.1.1.el8.x86_64.rpm \
    && dnf install -y \
	    ./mongodb-org-server-5.0.3-1.el8.x86_64.rpm \
		./mongodb-org-shell-5.0.3-1.el8.x86_64.rpm \
		./mongodb-mongosh-1.1.1.el8.x86_64.rpm \
	&& rm -f *.rpm \
	&& dnf install -y npm \
	&& dnf clean all

# Environment setup
COPY ["package.json", "tsconfig.json", "source/", ".env", "/data/"]
RUN npm install && npx tsc

# Command to run
CMD node ./build/server.js
