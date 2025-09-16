REALM=shop-realm
CLIENT=shop-client
cd /opt/keycloak/bin
./kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin --password admin
./kcadm.sh create realms -s realm=$REALM -s enabled=true --server http://localhost:8080
./kcadm.sh create clients -r $REALM -s clientId=$CLIENT -s directAccessGrantsEnabled=true -s publicClient=false -s secret=secret -s enabled=true

CLIENT_UUID=$(./kcadm.sh get clients -r $REALM -q clientId=$CLIENT --fields 'id' | grep -oE "[a-zA-Z0-9-]{3}+")

./kcadm.sh update clients/$CLIENT_UUID -r $REALM -s 'redirectUris=["/*"]' -s 'webOrigins=["/*"]'

./kcadm.sh create clients/$CLIENT_UUID/roles -r $REALM -s name=USER
./kcadm.sh create clients/$CLIENT_UUID/roles -r $REALM -s name=ADMIN
./kcadm.sh create clients/$CLIENT_UUID/protocol-mappers/models -r $REALM -s name="client roles" -s protocol="openid-connect" -s protocolMapper="oidc-usermodel-client-role-mapper" -s 'config."claim.name"=roles' -s 'config."access.token.claim"=true' -s 'config."userinfo.token.claim"=true'  -s 'config."usermodel.clientRoleMapping.clientId"=shop-client' -s 'config."multivalued"=true'

./kcadm.sh create users -r $REALM -s username=admin -s enabled=true -s email=admin@test -s emailVerified=true -s firstName=adm -s lastName=adm
./kcadm.sh set-password -r $REALM --username admin --new-password admin
./kcadm.sh add-roles -r $REALM --uusername admin --cclientid $CLIENT --rolename USER
./kcadm.sh add-roles -r $REALM --uusername admin --cclientid $CLIENT --rolename ADMIN

./kcadm.sh create users -r $REALM -s username=test11 -s enabled=true -s email=test11@test -s emailVerified=true -s firstName=t11 -s lastName=t11
./kcadm.sh set-password -r $REALM --username test11 --new-password test11
./kcadm.sh add-roles -r $REALM --uusername test11 --cclientid $CLIENT --rolename USER