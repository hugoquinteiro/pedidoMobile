--DROP TABLE produto 
CREATE TABLE produto (
codprod INTEGER NOT NULL,
descrprod CHARACTER VARYING(150),
marca CHARACTER VARYING(30),
referencia CHARACTER VARYING(30),
codbarra CHARACTER VARYING(13),
vlrvenda DECIMAL(12,2),
CONSTRAINT pk_produto PRIMARY KEY (codprod))

--DROP TABLE pedido
CREATE TABLE pedido (
  id SERIAL,
  usuario CHARACTER VARYING(30),
  dtcria TIMESTAMP,
  total DECIMAL(12,2),
  vlrdesc DECIMAL(12,2),
  CONSTRAINT pk_pedido PRIMARY KEY (id)
);
--INSERT INTO pedido (usuario, dtcria, total) VALUES ('Outros', CURRENT_TIMESTAMP, 100.99);


--DROP TABLE itpedido
CREATE TABLE itpedido (
  id INTEGER NOT NULL,
  codprod INTEGER NOT NULL,
  quantidade INTEGER,
  vlrvenda DECIMAL,
  codbarra CHARACTER VARYING(13),
  CONSTRAINT fk_itpedido_pedido FOREIGN KEY (id)
	  REFERENCES pedido (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION 
);
-- INSERT INTO itpedido VALUES (1, 147, 2, 50.5);


/*  SQL de busca no Sankhya
SELECT 
    exc.CODPROD
    ,pro.DESCRPROD
    ,bar.CODBARRA
    ,pro.REFERENCIA
    ,REPLACE(TO_CHAR(COALESCE(ROUND(exc.VLRVENDA,2),50.01)),',','.') as vlrvenda --temporario trocando nulo por 50.01
    ,pro.MARCA
FROM tgfexc exc
INNER JOIN tgfpro pro ON (exc.codprod = pro.codprod)
LEFT JOIN tgfbar bar ON (pro.codprod  = bar.codprod)
WHERE pro.marca NOT IN ('MQ TESOURA')
AND exc.nutab=440
*/