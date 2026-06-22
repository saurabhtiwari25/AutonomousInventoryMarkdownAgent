from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)

    inventory = relationship("Inventory", back_populates="product", uselist=False)
    sales = relationship("Sale", back_populates="product")
    pricing_history = relationship("PricingHistory", back_populates="product")
    profitability = relationship("Profitability", back_populates="product", uselist=False)

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    product_id_fk = Column(Integer, ForeignKey("products.id"))
    stock_quantity = Column(Integer, default=0)
    reorder_level = Column(Integer, default=0)
    last_restock_date = Column(Date, nullable=True)

    product = relationship("Product", back_populates="inventory")

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id_fk = Column(Integer, ForeignKey("products.id"))
    date = Column(Date, index=True)
    quantity_sold = Column(Integer, default=0)
    revenue = Column(Float, default=0.0)

    product = relationship("Product", back_populates="sales")

class PricingHistory(Base):
    __tablename__ = "pricing_history"

    id = Column(Integer, primary_key=True, index=True)
    product_id_fk = Column(Integer, ForeignKey("products.id"))
    price = Column(Float, nullable=False)
    effective_date = Column(DateTime, server_default=func.now())
    reason = Column(String, nullable=True)

    product = relationship("Product", back_populates="pricing_history")

class Profitability(Base):
    __tablename__ = "profitability"

    id = Column(Integer, primary_key=True, index=True)
    product_id_fk = Column(Integer, ForeignKey("products.id"))
    unit_cost = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    margin_percentage = Column(Float, nullable=False)

    product = relationship("Product", back_populates="profitability")
